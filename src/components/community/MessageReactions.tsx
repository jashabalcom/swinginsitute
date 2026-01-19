import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SmilePlus, Lock, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Reaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction: string;
}

interface MessageReactionsProps {
  messageId: string;
  reactions: Reaction[];
  currentUserId: string;
  onReactionChange: () => void;
}

const AVAILABLE_REACTIONS = ["👍", "🔥", "💪", "⚾", "👏", "🎯"];

export function MessageReactions({
  messageId,
  reactions,
  currentUserId,
  onReactionChange,
}: MessageReactionsProps) {
  const { profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const isFreeTier = profile?.is_free_tier ?? false;

  // Group reactions by emoji
  const reactionGroups = reactions.reduce((acc, r) => {
    if (!acc[r.reaction]) {
      acc[r.reaction] = { count: 0, hasUserReacted: false };
    }
    acc[r.reaction].count++;
    if (r.user_id === currentUserId) {
      acc[r.reaction].hasUserReacted = true;
    }
    return acc;
  }, {} as Record<string, { count: number; hasUserReacted: boolean }>);

  const handleReaction = async (emoji: string) => {
    if (loading || isFreeTier) return;
    setLoading(true);

    try {
      const existingReaction = reactions.find(
        (r) => r.user_id === currentUserId && r.reaction === emoji
      );

      if (existingReaction) {
        // Remove reaction
        const { error } = await supabase
          .from("message_reactions")
          .delete()
          .eq("id", existingReaction.id);

        if (error) throw error;
      } else {
        // Add reaction
        const { error } = await supabase.from("message_reactions").insert({
          message_id: messageId,
          user_id: currentUserId,
          reaction: emoji,
        });

        if (error) throw error;
      }

      onReactionChange();
      setIsOpen(false);
    } catch (error) {
      console.error("Error toggling reaction:", error);
      toast({
        title: "Error",
        description: "Failed to update reaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1 mt-1">
      {/* Existing reactions */}
      <AnimatePresence>
        {Object.entries(reactionGroups).map(([emoji, { count, hasUserReacted }]) => (
          <motion.button
            key={emoji}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => handleReaction(emoji)}
            disabled={loading}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors ${
              hasUserReacted
                ? "bg-secondary/20 border border-secondary/50"
                : "bg-muted/50 border border-border hover:bg-muted"
            }`}
          >
            <span>{emoji}</span>
            <span className="text-muted-foreground">{count}</span>
          </motion.button>
        ))}
      </AnimatePresence>

      {/* Add reaction button */}
      {isFreeTier ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="p-1 rounded-full hover:bg-muted/50 transition-colors opacity-0 group-hover:opacity-100 cursor-not-allowed"
            >
              <SmilePlus className="w-4 h-4 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p className="text-sm">Upgrade to react</p>
            <Link to="/checkout" className="text-primary text-xs flex items-center gap-1 mt-1">
              Upgrade now <ArrowRight className="w-3 h-3" />
            </Link>
          </TooltipContent>
        </Tooltip>
      ) : (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button
              className="p-1 rounded-full hover:bg-muted/50 transition-colors opacity-0 group-hover:opacity-100"
              disabled={loading}
            >
              <SmilePlus className="w-4 h-4 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-2 bg-card border-border"
            align="start"
            side="top"
          >
            <div className="flex gap-1">
              {AVAILABLE_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  disabled={loading}
                  className="p-2 text-lg hover:bg-muted rounded transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
