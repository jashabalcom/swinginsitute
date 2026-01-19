import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";

interface Poll {
  id: string;
  post_id: string;
  question: string;
  options: string[];
  ends_at: string | null;
  allow_multiple: boolean;
}

interface PollVote {
  id: string;
  poll_id: string;
  user_id: string;
  option_index: number;
}

interface PollDisplayProps {
  postId: string;
}

export function PollDisplay({ postId }: PollDisplayProps) {
  const { user } = useAuth();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [votes, setVotes] = useState<PollVote[]>([]);
  const [userVotes, setUserVotes] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    async function fetchPoll() {
      const { data: pollData } = await supabase
        .from("polls")
        .select("*")
        .eq("post_id", postId)
        .single();

      if (pollData) {
        // Parse options from JSONB
        const options = Array.isArray(pollData.options) 
          ? pollData.options 
          : JSON.parse(pollData.options as string);
        
        setPoll({ ...pollData, options } as Poll);

        // Fetch votes
        const { data: votesData } = await supabase
          .from("poll_votes")
          .select("*")
          .eq("poll_id", pollData.id);

        if (votesData) {
          setVotes(votesData);
          if (user) {
            const userVoteIndices = votesData
              .filter(v => v.user_id === user.id)
              .map(v => v.option_index);
            setUserVotes(userVoteIndices);
          }
        }
      }
      setLoading(false);
    }

    fetchPoll();
  }, [postId, user]);

  const handleVote = async (optionIndex: number) => {
    if (!user || !poll || voting) return;

    setVoting(true);
    try {
      if (userVotes.includes(optionIndex)) {
        // Remove vote
        await supabase
          .from("poll_votes")
          .delete()
          .eq("poll_id", poll.id)
          .eq("user_id", user.id)
          .eq("option_index", optionIndex);

        setUserVotes(userVotes.filter(v => v !== optionIndex));
        setVotes(votes.filter(v => !(v.user_id === user.id && v.option_index === optionIndex)));
      } else {
        // Add vote
        if (!poll.allow_multiple && userVotes.length > 0) {
          // Remove existing vote first
          await supabase
            .from("poll_votes")
            .delete()
            .eq("poll_id", poll.id)
            .eq("user_id", user.id);

          setVotes(votes.filter(v => v.user_id !== user.id));
        }

        const { data: newVote } = await supabase
          .from("poll_votes")
          .insert({
            poll_id: poll.id,
            user_id: user.id,
            option_index: optionIndex,
          })
          .select()
          .single();

        if (newVote) {
          if (!poll.allow_multiple) {
            setUserVotes([optionIndex]);
          } else {
            setUserVotes([...userVotes, optionIndex]);
          }
          setVotes([...votes.filter(v => poll.allow_multiple || v.user_id !== user.id), newVote]);
        }
      }
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setVoting(false);
    }
  };

  if (loading || !poll) return null;

  const totalVotes = votes.length;
  const hasVoted = userVotes.length > 0;
  const isExpired = poll.ends_at ? new Date(poll.ends_at) < new Date() : false;

  const getVoteCount = (optionIndex: number) => {
    return votes.filter(v => v.option_index === optionIndex).length;
  };

  const getPercentage = (optionIndex: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((getVoteCount(optionIndex) / totalVotes) * 100);
  };

  return (
    <div className="bg-muted/30 rounded-lg p-4 space-y-3">
      <p className="font-medium">{poll.question}</p>

      <div className="space-y-2">
        {poll.options.map((option, index) => {
          const percentage = getPercentage(index);
          const voteCount = getVoteCount(index);
          const isSelected = userVotes.includes(index);

          return (
            <button
              key={index}
              onClick={() => !isExpired && handleVote(index)}
              disabled={isExpired || voting}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-muted-foreground/50"
              } ${isExpired ? "cursor-default" : "cursor-pointer"}`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {isSelected && <Check className="w-4 h-4 text-primary" />}
                  <span className={isSelected ? "font-medium" : ""}>{option}</span>
                </div>
                {(hasVoted || isExpired) && (
                  <span className="text-sm text-muted-foreground">
                    {percentage}% ({voteCount})
                  </span>
                )}
              </div>
              {(hasVoted || isExpired) && (
                <Progress value={percentage} className="h-1.5" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{totalVotes} vote{totalVotes !== 1 ? "s" : ""}</span>
        {poll.ends_at && (
          <span>
            {isExpired
              ? "Poll ended"
              : `Ends ${new Date(poll.ends_at).toLocaleDateString()}`}
          </span>
        )}
      </div>
    </div>
  );
}
