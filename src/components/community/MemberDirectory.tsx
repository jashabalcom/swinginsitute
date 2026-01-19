import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

interface Member {
  user_id: string;
  player_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  membership_tier: string | null;
}

const tierBadgeColors: Record<string, string> = {
  starter: "bg-muted text-muted-foreground",
  pro: "bg-secondary/20 text-secondary",
  elite: "bg-gradient-to-r from-amber-600/20 to-amber-500/20 text-amber-400",
  hybrid: "bg-primary/20 text-primary",
};

interface MemberDirectoryProps {
  onClose?: () => void;
  className?: string;
}

export function MemberDirectory({ onClose, className = "" }: MemberDirectoryProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchMembers() {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, player_name, full_name, avatar_url, membership_tier")
        .not("onboarding_completed", "is", null)
        .eq("onboarding_completed", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching members:", error);
        return;
      }

      setMembers(data || []);
      setLoading(false);
    }

    fetchMembers();
  }, []);

  const filteredMembers = members.filter((member) => {
    const name = member.player_name || member.full_name || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getDisplayName = (member: Member) => {
    return member.player_name || member.full_name || "Anonymous";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-card border-l border-border flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-secondary" />
            <h3 className="font-display text-lg font-bold text-foreground">
              Members
            </h3>
            <span className="text-xs text-muted-foreground">
              ({members.length})
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-muted transition-colors lg:hidden"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search members..."
            className="pl-9 bg-muted border-border text-sm"
          />
        </div>
      </div>

      {/* Member List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {loading ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              Loading members...
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              No members found
            </div>
          ) : (
            filteredMembers.map((member) => {
              const displayName = getDisplayName(member);
              const tier = member.membership_tier || "starter";

              return (
                <div
                  key={member.user_id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="w-8 h-8 border border-border">
                    <AvatarImage src={member.avatar_url || undefined} alt={displayName} />
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {displayName}
                    </p>
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${tierBadgeColors[tier]}`}
                    >
                      {tier}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
}
