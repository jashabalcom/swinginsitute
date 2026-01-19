import { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Channel {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
}

interface Message {
  id: string;
  channel_id: string;
  user_id: string;
  content: string;
  created_at: string;
  displayName?: string;
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
  const scrollRef = useRef<HTMLDivElement>(null);
  
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

  // Fetch messages for active channel
  useEffect(() => {
    async function fetchMessages() {
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
      
      if (!messagesData) {
        setMessages([]);
        return;
      }
      
      // Fetch profiles for all unique user IDs
      const userIds = [...new Set(messagesData.map(m => m.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, player_name, full_name")
        .in("user_id", userIds);
      
      const profileMap = new Map(
        profilesData?.map(p => [p.user_id, p.player_name || p.full_name || "Anonymous"]) || []
      );
      
      const messagesWithNames: Message[] = messagesData.map(msg => ({
        ...msg,
        displayName: profileMap.get(msg.user_id) || "Anonymous",
      }));
      
      setMessages(messagesWithNames);
    }
    
    fetchMessages();
  }, [activeChannel]);

  // Subscribe to realtime messages
  useEffect(() => {
    if (!activeChannel) return;
    
    const channel = supabase
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
          const newMsg = payload.new as { id: string; channel_id: string; user_id: string; content: string; created_at: string };
          
          // Fetch the profile for this user
          const { data: profileData } = await supabase
            .from("profiles")
            .select("player_name, full_name")
            .eq("user_id", newMsg.user_id)
            .single();
          
          const messageWithName: Message = {
            ...newMsg,
            displayName: profileData?.player_name || profileData?.full_name || "Anonymous",
          };
          
          setMessages((prev) => [...prev, messageWithName]);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChannel]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChannel || !user) return;
    
    setSending(true);
    try {
      const { error } = await supabase.from("messages").insert({
        channel_id: activeChannel.id,
        user_id: user.id,
        content: newMessage.trim(),
      });
      
      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16 flex">
        {/* Sidebar - Channels */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-64 bg-card border-r border-border flex flex-col"
        >
          <div className="p-4 border-b border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Link to="/" className="inline-block mb-2">
              <img 
                src="https://assets.cdn.filesafe.space/zwZcjJjCjMcDGRS6V7qs/media/683fafe628def090f992833c.png"
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
              {channels.map((channel) => {
                const IconComponent = iconMap[channel.icon || "message-square"] || Hash;
                const isActive = activeChannel?.id === channel.id;
                
                return (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel)}
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
        </motion.aside>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeChannel ? (
            <>
              {/* Channel Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 py-4 border-b border-border bg-card/50"
              >
                <div className="flex items-center gap-3">
                  {(() => {
                    const IconComponent = iconMap[activeChannel.icon || "message-square"] || Hash;
                    return <IconComponent className="w-5 h-5 text-primary" />;
                  })()}
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground">
                      {activeChannel.name}
                    </h3>
                    {activeChannel.description && (
                      <p className="text-sm text-muted-foreground">
                        {activeChannel.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Messages */}
              <ScrollArea ref={scrollRef} className="flex-1 px-6 py-4">
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
                    messageGroups.map((group, groupIndex) => (
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
                                className={`flex gap-3 ${isOwnMessage ? "flex-row-reverse" : ""}`}
                              >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  isOwnMessage ? "bg-primary" : "bg-secondary"
                                }`}>
                                  <span className="text-xs font-semibold text-white">
                                    {displayName.charAt(0).toUpperCase()}
                                  </span>
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
                                  <div className={`inline-block px-4 py-2 rounded-lg ${
                                    isOwnMessage 
                                      ? "bg-primary/10 text-foreground" 
                                      : "bg-muted text-foreground"
                                  }`}>
                                    <p className="text-sm whitespace-pre-wrap break-words">
                                      {message.content}
                                    </p>
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

              {/* Message Input */}
              <div className="px-6 py-4 border-t border-border bg-card/50">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Message #${activeChannel.slug}...`}
                    className="flex-1 bg-muted border-border focus:border-primary"
                    disabled={sending}
                  />
                  <Button 
                    type="submit" 
                    disabled={!newMessage.trim() || sending}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground">Select a channel to start chatting</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}