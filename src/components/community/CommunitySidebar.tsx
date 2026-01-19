import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Hash, MessageCircle, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useGamification, getProgressToNextLevel, getLevelName } from "@/hooks/useGamification";
import { LevelBadge } from "./LevelBadge";
import { Leaderboard } from "./Leaderboard";
import swingInstituteLogo from "@/assets/swing-institute-logo.png";

interface Channel {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
}

interface CommunitySidebarProps {
  channels: Channel[];
  activeChannel: Channel | null;
  viewMode: "feed" | "dm-list" | "dm-chat";
  onChannelSelect: (channel: Channel) => void;
  onDMClick: () => void;
  onNewPost?: () => void;
  onClose?: () => void;
}

export function CommunitySidebar({
  channels,
  activeChannel,
  viewMode,
  onChannelSelect,
  onDMClick,
  onNewPost,
  onClose,
}: CommunitySidebarProps) {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { userPoints, loading: gamificationLoading } = useGamification();

  const level = userPoints?.level || 1;
  const points = userPoints?.total_points || 0;
  const progress = getProgressToNextLevel(points);

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            navigate("/dashboard");
            onClose?.();
          }}
          className="text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <Link to="/" className="inline-block mb-2" onClick={onClose}>
          <img
            src={swingInstituteLogo}
            alt="Swing Institute"
            className="h-8 w-auto object-contain"
          />
        </Link>
        <h2 className="font-display text-lg font-bold text-foreground">Community</h2>
      </div>

      {/* User Profile Card */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/20 text-primary font-semibold">
              {(profile?.player_name || profile?.full_name || "?")[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">
              {profile?.player_name || profile?.full_name || "Member"}
            </p>
            <div className="flex items-center gap-2">
              <LevelBadge level={level} size="sm" />
              <span className="text-xs text-muted-foreground">
                {getLevelName(level)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Level Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{points.toLocaleString()} pts</span>
            {level < 10 && <span>{progress.next.toLocaleString()} pts</span>}
          </div>
          <Progress value={progress.percentage} className="h-1.5" />
        </div>
      </div>

      {/* New Post Button */}
      {onNewPost && (
        <div className="p-3">
          <Button onClick={onNewPost} className="w-full" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {/* DMs Button */}
          <button
            onClick={() => {
              onDMClick();
              onClose?.();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              viewMode === "dm-list" || viewMode === "dm-chat"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <MessageCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">Direct Messages</span>
          </button>

          <Separator className="my-2" />

          {/* Channels */}
          <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Channels
          </p>
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => {
                onChannelSelect(channel);
                onClose?.();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeChannel?.id === channel.id && viewMode === "feed"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Hash className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium truncate">{channel.name}</span>
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* Leaderboard Widget */}
      <div className="p-3 border-t border-border">
        <Leaderboard limit={3} />
      </div>

      {/* Settings */}
      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
          onClick={() => {
            navigate("/settings");
            onClose?.();
          }}
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
}
