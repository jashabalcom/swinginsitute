import { Link } from "react-router-dom";
import { Lock, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function ReadOnlyPostComposer() {
  const { profile } = useAuth();

  return (
    <div className="p-4">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={profile?.avatar_url || undefined} />
          <AvatarFallback className="bg-primary/20 text-primary">
            {(profile?.player_name || profile?.full_name || "?")[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div 
            className="min-h-[60px] rounded-lg bg-muted/50 border border-dashed border-border p-4 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Upgrade to share with the community</span>
            </div>
            <Link to="/checkout">
              <Button size="sm" variant="outline" className="shrink-0">
                Upgrade
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
