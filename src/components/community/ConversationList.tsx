import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Conversation {
  id: string;
  participant_1: string;
  participant_2: string;
  updated_at: string;
  other_user?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  last_message?: string;
  unread_count?: number;
}

interface ConversationListProps {
  onSelectConversation: (conversationId: string, otherUser: { id: string; full_name: string | null; avatar_url: string | null }) => void;
  onBack: () => void;
}

export const ConversationList = ({ onSelectConversation, onBack }: ConversationListProps) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      // Fetch conversations where user is a participant
      const { data: convData, error: convError } = await supabase
        .from("conversations")
        .select("*")
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order("updated_at", { ascending: false });

      if (convError) throw convError;

      if (!convData || convData.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // Get other user IDs
      const otherUserIds = convData.map((c) =>
        c.participant_1 === user.id ? c.participant_2 : c.participant_1
      );

      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .in("user_id", otherUserIds);

      if (profilesError) throw profilesError;

      // Fetch last messages and unread counts
      const conversationsWithDetails = await Promise.all(
        convData.map(async (conv) => {
          const otherUserId = conv.participant_1 === user.id ? conv.participant_2 : conv.participant_1;
          const otherProfile = profiles?.find((p) => p.user_id === otherUserId);

          // Get last message
          const { data: lastMsg } = await supabase
            .from("direct_messages")
            .select("content")
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          // Get unread count
          const { count } = await supabase
            .from("direct_messages")
            .select("*", { count: "exact", head: true })
            .eq("conversation_id", conv.id)
            .neq("sender_id", user.id)
            .is("read_at", null);

          return {
            ...conv,
            other_user: otherProfile
              ? {
                  id: otherProfile.user_id,
                  full_name: otherProfile.full_name,
                  avatar_url: otherProfile.avatar_url,
                }
              : { id: otherUserId, full_name: null, avatar_url: null },
            last_message: lastMsg?.content || "No messages yet",
            unread_count: count || 0,
          };
        })
      );

      setConversations(conversationsWithDetails);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="font-semibold text-lg">Direct Messages</h2>
      </div>

      <ScrollArea className="flex-1">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12 px-4">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No conversations yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Click on a member in the directory to start a conversation
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => conv.other_user && onSelectConversation(conv.id, conv.other_user)}
                className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conv.other_user?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(conv.other_user?.full_name || null)}
                    </AvatarFallback>
                  </Avatar>
                  {conv.unread_count && conv.unread_count > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-medium truncate">
                      {conv.other_user?.full_name || "Unknown User"}
                    </p>
                    <span className="text-xs text-muted-foreground ml-2 shrink-0">
                      {formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conv.last_message}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
