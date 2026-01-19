import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Megaphone,
  Target,
  Trophy,
  HelpCircle,
  Users,
  Send,
  ArrowLeft,
  Hash,
  ImagePlus,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MemberDirectory } from "@/components/community/MemberDirectory";
import { MessageReactions } from "@/components/community/MessageReactions";
import { DirectMessagePanel } from "@/components/community/DirectMessagePanel";
import { ConversationList } from "@/components/community/ConversationList";
import { MentionInput, renderMessageWithMentions, extractMentions } from "@/components/community/MentionInput";
import swingInstituteLogo from "@/assets/swing-institute-logo.png";

interface Channel {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
}

interface Reaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction: string;
}

interface Message {
  id: string;
  channel_id: string;
  user_id: string;
  content: string;
  created_at: string;
  image_url?: string | null;
  displayName?: string;
  avatarUrl?: string | null;
  reactions?: Reaction[];
}

type ViewMode = "channels" | "dm-list" | "dm-chat";

interface DMUser {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

const iconMap: Record<string, typeof Megaphone> = {
  megaphone: Megaphone,
  target: Target,
  trophy: Trophy,
  "help-circle": HelpCircle,
  users: Users,
};

export default function TrainingRoom() {
  const navigate = useNavigate();
  const { user, profile, isOnboardingComplete, loading } = useAuth();
  const { toast } = useToast();
  
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showMobileChannels, setShowMobileChannels] = useState(false);
  const [showMemberDirectory, setShowMemberDirectory] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("channels");
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeDMUser, setActiveDMUser] = useState<DMUser | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (!loading && !isOnboardingComplete) {
      navigate("/onboarding");
    }
  }, [loading, isOnboardingComplete, navigate]);

  // Fetch channels
  useEffect(() => {
    async function fetchChannels() {
      const { data, error } = await supabase
        .from("channels")
        .select("*")
        .order("created_at");
      
      if (error) {
        console.error("Error fetching channels:", error);
        return;
      }
      
      setChannels(data || []);
      if (data && data.length > 0 && !activeChannel) {
        setActiveChannel(data[0]);
      }
    }
    
    if (user) {
      fetchChannels();
    }
  }, [user]);

  // Fetch messages with reactions for active channel
  const fetchMessages = useCallback(async () => {
    if (!activeChannel) return;
    
    const { data: messagesData, error } = await supabase
      .from("messages")
      .select("*")
      .eq("channel_id", activeChannel.id)
      .order("created_at", { ascending: true });
    
    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }
    
    if (!messagesData || messagesData.length === 0) {
      setMessages([]);
      return;
    }
    
    // Fetch profiles for all unique user IDs
    const userIds = [...new Set(messagesData.map(m => m.user_id))];
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("user_id, player_name, full_name, avatar_url")
      .in("user_id", userIds);
    
    // Fetch reactions for all messages
    const messageIds = messagesData.map(m => m.id);
    const { data: reactionsData } = await supabase
      .from("message_reactions")
      .select("*")
      .in("message_id", messageIds);
    
    const profileMap = new Map(
      profilesData?.map(p => [
        p.user_id, 
        { 
          name: p.player_name || p.full_name || "Anonymous",
          avatarUrl: p.avatar_url
        }
      ]) || []
    );
    
    const reactionsMap = new Map<string, Reaction[]>();
    reactionsData?.forEach(r => {
      if (!reactionsMap.has(r.message_id)) {
        reactionsMap.set(r.message_id, []);
      }
      reactionsMap.get(r.message_id)!.push(r);
    });
    
    const messagesWithData: Message[] = messagesData.map(msg => {
      const profileInfo = profileMap.get(msg.user_id);
      return {
        ...msg,
        displayName: profileInfo?.name || "Anonymous",
        avatarUrl: profileInfo?.avatarUrl || null,
        reactions: reactionsMap.get(msg.id) || [],
      };
    });
    
    setMessages(messagesWithData);
  }, [activeChannel]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Subscribe to realtime messages and reactions
  useEffect(() => {
    if (!activeChannel) return;
    
    const messagesChannel = supabase
      .channel(`messages:${activeChannel.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `channel_id=eq.${activeChannel.id}`,
        },
        async (payload) => {
          const newMsg = payload.new as { id: string; channel_id: string; user_id: string; content: string; created_at: string; image_url?: string };
          
          const { data: profileData } = await supabase
            .from("profiles")
            .select("player_name, full_name, avatar_url")
            .eq("user_id", newMsg.user_id)
            .single();
          
          const messageWithName: Message = {
            ...newMsg,
            displayName: profileData?.player_name || profileData?.full_name || "Anonymous",
            avatarUrl: profileData?.avatar_url || null,
            reactions: [],
          };
          
          setMessages((prev) => [...prev, messageWithName]);
        }
      )
      .subscribe();

    // Subscribe to reactions changes
    const reactionsChannel = supabase
      .channel(`reactions:${activeChannel.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "message_reactions",
        },
        () => {
          // Refetch messages to get updated reactions
          fetchMessages();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(reactionsChannel);
    };
  }, [activeChannel, fetchMessages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, WebP, or GIF image.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImageSelection = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!newMessage.trim() && !selectedImage) || !activeChannel || !user) return;
    
    setSending(true);
    try {
      let imageUrl: string | null = null;

      // Upload image if selected
      if (selectedImage) {
        setUploadingImage(true);
        const fileExt = selectedImage.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("chat-images")
          .upload(filePath, selectedImage);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("chat-images")
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
        setUploadingImage(false);
      }

      const messageContent = newMessage.trim() || (imageUrl ? "" : "");

      const { data: insertedMessage, error } = await supabase.from("messages").insert({
        channel_id: activeChannel.id,
        user_id: user.id,
        content: messageContent,
        image_url: imageUrl,
      }).select().single();
      
      if (error) throw error;

      // Handle mentions
      const mentionedNames = extractMentions(messageContent);
      if (mentionedNames.length > 0 && insertedMessage) {
        // Find users matching the mentioned names
        const { data: mentionedProfiles } = await supabase
          .from("profiles")
          .select("user_id, player_name, full_name")
          .or(mentionedNames.map(name => `player_name.ilike.${name},full_name.ilike.${name}`).join(","));

        if (mentionedProfiles && mentionedProfiles.length > 0) {
          // Create mention records and notifications
          const mentionInserts = mentionedProfiles
            .filter(p => p.user_id !== user.id)
            .map(p => ({
              message_id: insertedMessage.id,
              mentioned_user_id: p.user_id,
              mentioner_user_id: user.id,
            }));

          const notificationInserts = mentionedProfiles
            .filter(p => p.user_id !== user.id)
            .map(p => ({
              user_id: p.user_id,
              type: "mention",
              title: `${profile?.player_name || profile?.full_name || "Someone"} mentioned you`,
              content: messageContent.slice(0, 100),
              link: "/training-room",
            }));

          if (mentionInserts.length > 0) {
            await supabase.from("mentions").insert(mentionInserts);
          }
          if (notificationInserts.length > 0) {
            await supabase.from("notifications").insert(notificationInserts);
          }
        }
      }

      setNewMessage("");
      clearImageSelection();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
      setUploadingImage(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  const groupMessagesByDate = (msgs: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = "";
    
    msgs.forEach((msg) => {
      const msgDate = new Date(msg.created_at).toDateString();
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groups.push({ date: msg.created_at, messages: [msg] });
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    });
    
    return groups;
  };

  if (loading || !isOnboardingComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  const handleStartDM = (conversationId: string, otherUser: DMUser) => {
    setActiveConversationId(conversationId);
    setActiveDMUser(otherUser);
    setViewMode("dm-chat");
    setShowMemberDirectory(false);
  };

  // Channel sidebar content (shared between desktop and mobile)
  const ChannelSidebar = () => (
    <>
      <div className="p-4 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            navigate("/dashboard");
            setShowMobileChannels(false);
          }}
          className="text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <Link to="/" className="inline-block mb-2">
          <img 
            src={swingInstituteLogo}
            alt="Swing Institute"
            className="h-10 w-auto object-contain"
          />
        </Link>
        <h2 className="font-display text-xl font-bold text-foreground">
          Training Room
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Connect with other players
        </p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {/* DMs Button */}
          <button
            onClick={() => {
              setViewMode("dm-list");
              setActiveChannel(null);
              setShowMobileChannels(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              viewMode === "dm-list" || viewMode === "dm-chat"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <MessageCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium truncate">
              Direct Messages
            </span>
          </button>

          <div className="my-2 border-t border-border" />

          {channels.map((channel) => {
            const IconComponent = iconMap[channel.icon || "message-square"] || Hash;
            const isActive = activeChannel?.id === channel.id && viewMode === "channels";
            
            return (
              <button
                key={channel.id}
                onClick={() => {
                  setActiveChannel(channel);
                  setViewMode("channels");
                  setShowMobileChannels(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <IconComponent className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium truncate">
                  {channel.name}
                </span>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16 flex overflow-hidden">
        {/* Desktop Sidebar - Channels */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex w-64 bg-card border-r border-border flex-col flex-shrink-0"
        >
          <ChannelSidebar />
        </motion.aside>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* DM Views */}
          {viewMode === "dm-list" && (
            <ConversationList
              onSelectConversation={(convId, otherUser) => {
                setActiveConversationId(convId);
                setActiveDMUser(otherUser);
                setViewMode("dm-chat");
              }}
              onBack={() => {
                setViewMode("channels");
                if (channels.length > 0) {
                  setActiveChannel(channels[0]);
                }
              }}
            />
          )}

          {viewMode === "dm-chat" && activeConversationId && activeDMUser && (
            <DirectMessagePanel
              conversationId={activeConversationId}
              otherUser={activeDMUser}
              onBack={() => setViewMode("dm-list")}
            />
          )}

          {/* Channel View */}
          {viewMode === "channels" && activeChannel ? (
            <>
              {/* Channel Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 md:px-6 py-3 md:py-4 border-b border-border bg-card/50 flex-shrink-0"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Mobile menu button */}
                    <Sheet open={showMobileChannels} onOpenChange={setShowMobileChannels}>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="sm" className="md:hidden p-2">
                          <Menu className="w-5 h-5" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-64 p-0 bg-card border-border">
                        <div className="flex flex-col h-full">
                          <ChannelSidebar />
                        </div>
                      </SheetContent>
                    </Sheet>

                    {(() => {
                      const IconComponent = iconMap[activeChannel.icon || "message-square"] || Hash;
                      return <IconComponent className="w-5 h-5 text-primary flex-shrink-0" />;
                    })()}
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-bold text-foreground truncate">
                        {activeChannel.name}
                      </h3>
                      {activeChannel.description && (
                        <p className="text-sm text-muted-foreground truncate hidden sm:block">
                          {activeChannel.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Member directory toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMemberDirectory(!showMemberDirectory)}
                    className={`p-2 ${showMemberDirectory ? "bg-muted" : ""}`}
                  >
                    <Users className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>

              <div className="flex-1 flex overflow-hidden">
                {/* Messages Area */}
                <div className="flex-1 flex flex-col min-w-0">
                  <ScrollArea ref={scrollRef} className="flex-1 px-4 md:px-6 py-4">
                    <AnimatePresence mode="popLayout">
                      {messageGroups.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-col items-center justify-center h-full text-center py-20"
                        >
                          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            {(() => {
                              const IconComponent = iconMap[activeChannel.icon || "message-square"] || Hash;
                              return <IconComponent className="w-8 h-8 text-muted-foreground" />;
                            })()}
                          </div>
                          <h4 className="font-display text-xl font-bold text-foreground mb-2">
                            Welcome to {activeChannel.name}
                          </h4>
                          <p className="text-muted-foreground max-w-md">
                            This is the beginning of the {activeChannel.name} channel. 
                            Start the conversation!
                          </p>
                        </motion.div>
                      ) : (
                        messageGroups.map((group) => (
                          <div key={group.date} className="mb-6">
                            {/* Date Divider */}
                            <div className="flex items-center gap-4 mb-4">
                              <div className="flex-1 h-px bg-border" />
                              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                {formatDate(group.date)}
                              </span>
                              <div className="flex-1 h-px bg-border" />
                            </div>
                            
                            {/* Messages for this date */}
                            <div className="space-y-4">
                              {group.messages.map((message, msgIndex) => {
                                const displayName = message.displayName || "Anonymous";
                                const isOwnMessage = message.user_id === user?.id;
                                
                                return (
                                  <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: msgIndex * 0.02 }}
                                    className={`group flex gap-3 ${isOwnMessage ? "flex-row-reverse" : ""}`}
                                  >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${
                                      isOwnMessage ? "bg-primary" : "bg-secondary"
                                    }`}>
                                      {message.avatarUrl ? (
                                        <img 
                                          src={message.avatarUrl} 
                                          alt={displayName}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <span className="text-xs font-semibold text-white">
                                          {displayName.charAt(0).toUpperCase()}
                                        </span>
                                      )}
                                    </div>
                                    <div className={`flex-1 max-w-xl ${isOwnMessage ? "text-right" : ""}`}>
                                      <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? "justify-end" : ""}`}>
                                        <span className="text-sm font-semibold text-foreground">
                                          {displayName}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {formatTime(message.created_at)}
                                        </span>
                                      </div>
                                      <div className={`inline-block ${isOwnMessage ? "text-right" : "text-left"}`}>
                                        {/* Image if present */}
                                        {message.image_url && (
                                          <img
                                            src={message.image_url}
                                            alt="Shared image"
                                            className="max-w-xs md:max-w-sm rounded-lg mb-2 cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => window.open(message.image_url!, "_blank")}
                                          />
                                        )}
                                        {/* Text content */}
                                        {message.content && (
                                          <div className={`inline-block px-4 py-2 rounded-lg ${
                                            isOwnMessage 
                                              ? "bg-primary/10 text-foreground" 
                                              : "bg-muted text-foreground"
                                          }`}>
                                            <p className="text-sm whitespace-pre-wrap break-words">
                                              {renderMessageWithMentions(message.content)}
                                            </p>
                                          </div>
                                        )}
                                        {/* Reactions */}
                                        <MessageReactions
                                          messageId={message.id}
                                          reactions={message.reactions || []}
                                          currentUserId={user?.id || ""}
                                          onReactionChange={fetchMessages}
                                        />
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                        ))
                      )}
                    </AnimatePresence>
                  </ScrollArea>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="px-4 md:px-6 py-3 border-t border-border bg-card/50">
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-32 rounded-lg border border-border"
                        />
                        <button
                          onClick={clearImageSelection}
                          className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Message Input */}
                  <div className="px-4 md:px-6 py-3 md:py-4 border-t border-border bg-card/50 flex-shrink-0">
                    <form onSubmit={handleSendMessage} className="flex gap-2 md:gap-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={sending || uploadingImage}
                        className="flex-shrink-0"
                      >
                        <ImagePlus className="w-5 h-5 text-muted-foreground" />
                      </Button>
                      <MentionInput
                        value={newMessage}
                        onChange={setNewMessage}
                        onSubmit={() => handleSendMessage()}
                        placeholder={`Message #${activeChannel.slug}... (use @ to mention)`}
                        className="flex-1 bg-muted border-border focus:border-primary"
                        disabled={sending || uploadingImage}
                      />
                      <Button 
                        type="submit" 
                        disabled={(!newMessage.trim() && !selectedImage) || sending || uploadingImage}
                        className="bg-primary hover:bg-primary/90 flex-shrink-0"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </div>

                {/* Member Directory Sidebar (Desktop) */}
                <AnimatePresence>
                  {showMemberDirectory && (
                    <MemberDirectory
                      onClose={() => setShowMemberDirectory(false)}
                      onStartDM={handleStartDM}
                      className="hidden lg:flex w-64 flex-shrink-0"
                    />
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : viewMode === "channels" && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground">Select a channel to start chatting</p>
            </div>
          )}
        </div>

        {/* Member Directory Sheet (Mobile/Tablet) */}
        <Sheet open={showMemberDirectory} onOpenChange={setShowMemberDirectory}>
          <SheetContent side="right" className="w-72 p-0 bg-card border-border lg:hidden">
            <MemberDirectory 
              onClose={() => setShowMemberDirectory(false)} 
              onStartDM={handleStartDM}
              className="h-full" 
            />
          </SheetContent>
        </Sheet>
      </main>
    </div>
  );
}
