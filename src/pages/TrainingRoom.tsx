import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Users, Home, MessageCircle, PlusCircle, User } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CommunitySidebar } from "@/components/community/CommunitySidebar";
import { PostComposer } from "@/components/community/PostComposer";
import { PostFeed } from "@/components/community/PostFeed";
import { MemberDirectory } from "@/components/community/MemberDirectory";
import { ConversationList } from "@/components/community/ConversationList";
import { DirectMessagePanel } from "@/components/community/DirectMessagePanel";
import { cn } from "@/lib/utils";

interface Channel {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
}

interface DMUser {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

type ViewMode = "feed" | "dm-list" | "dm-chat";

export default function TrainingRoom() {
  const navigate = useNavigate();
  const { user, isOnboardingComplete, loading } = useAuth();

  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("feed");
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeDMUser, setActiveDMUser] = useState<DMUser | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [refreshFeed, setRefreshFeed] = useState(0);

  useEffect(() => {
    if (!loading && !isOnboardingComplete) {
      navigate("/onboarding");
    }
  }, [loading, isOnboardingComplete, navigate]);

  // Fetch channels
  useEffect(() => {
    async function fetchChannels() {
      const { data } = await supabase
        .from("channels")
        .select("*")
        .order("created_at");

      if (data && data.length > 0) {
        setChannels(data);
        if (!activeChannel) {
          setActiveChannel(data[0]);
        }
      }
    }

    if (user) {
      fetchChannels();
    }
  }, [user]);

  const handleChannelSelect = (channel: Channel) => {
    setActiveChannel(channel);
    setViewMode("feed");
  };

  const handleDMClick = () => {
    setViewMode("dm-list");
    setActiveChannel(null);
  };

  const handleStartDM = (conversationId: string, otherUser: DMUser) => {
    setActiveConversationId(conversationId);
    setActiveDMUser(otherUser);
    setViewMode("dm-chat");
    setShowMembers(false);
  };

  if (loading || !isOnboardingComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 flex pt-16 md:pt-20">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-72 border-r border-border/50 flex-shrink-0 bg-card/50">
          <CommunitySidebar
            channels={channels}
            activeChannel={activeChannel}
            viewMode={viewMode}
            onChannelSelect={handleChannelSelect}
            onDMClick={handleDMClick}
            onNewPost={() => setRefreshFeed(r => r + 1)}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-2 p-4 border-b border-border">
            <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <CommunitySidebar
                  channels={channels}
                  activeChannel={activeChannel}
                  viewMode={viewMode}
                  onChannelSelect={handleChannelSelect}
                  onDMClick={handleDMClick}
                  onClose={() => setShowMobileMenu(false)}
                />
              </SheetContent>
            </Sheet>

            <h1 className="font-semibold flex-1">
              {viewMode === "feed" && activeChannel
                ? `# ${activeChannel.name}`
                : viewMode === "dm-chat" && activeDMUser
                ? activeDMUser.full_name || "Direct Message"
                : "Direct Messages"}
            </h1>

            <Button variant="ghost" size="icon" onClick={() => setShowMembers(!showMembers)}>
              <Users className="w-5 h-5" />
            </Button>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden pb-20 lg:pb-0">
            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              {viewMode === "feed" && activeChannel && (
                <div className="max-w-2xl mx-auto space-y-4">
                  {/* Post Composer - Clean card design */}
                  <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm">
                    <PostComposer
                      channelId={activeChannel.id}
                      onPostCreated={() => setRefreshFeed(r => r + 1)}
                    />
                  </div>
                  <PostFeed channelId={activeChannel.id} refreshTrigger={refreshFeed} />
                </div>
              )}

              {viewMode === "dm-list" && (
                <div className="max-w-xl mx-auto">
                  <h2 className="font-display text-xl font-bold mb-4">Direct Messages</h2>
                  <ConversationList onSelectConversation={handleStartDM} onBack={() => setViewMode("feed")} />
                </div>
              )}

              {viewMode === "dm-chat" && activeConversationId && activeDMUser && (
                <DirectMessagePanel
                  conversationId={activeConversationId}
                  otherUser={activeDMUser}
                  onBack={() => setViewMode("dm-list")}
                />
              )}
            </div>

            {/* Desktop Member Directory */}
            {viewMode === "feed" && (
              <aside className="hidden xl:block w-64 border-l border-border p-4 flex-shrink-0">
                <MemberDirectory onStartDM={handleStartDM} />
              </aside>
            )}
          </div>
        </main>

        {/* Mobile Member Directory */}
        <Sheet open={showMembers} onOpenChange={setShowMembers}>
          <SheetContent side="right" className="w-80">
            <MemberDirectory onStartDM={handleStartDM} />
          </SheetContent>
        </Sheet>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border pb-safe">
          <div className="flex items-center justify-around h-16 px-4">
            <button
              onClick={() => { setViewMode("feed"); if (channels[0]) setActiveChannel(channels[0]); }}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-lg transition-all",
                viewMode === "feed" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Home className="h-5 w-5" />
              <span className="text-[10px] font-medium">Feed</span>
            </button>
            <button
              onClick={() => setViewMode("dm-list")}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-lg transition-all",
                viewMode === "dm-list" || viewMode === "dm-chat" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-[10px] font-medium">DMs</span>
            </button>
            <button
              onClick={() => setShowMobileMenu(true)}
              className="bg-primary text-primary-foreground -mt-4 shadow-lg rounded-full p-3"
            >
              <PlusCircle className="h-6 w-6" />
            </button>
            <button
              onClick={() => setShowMembers(true)}
              className="flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-lg transition-all text-muted-foreground hover:text-foreground"
            >
              <Users className="h-5 w-5" />
              <span className="text-[10px] font-medium">Members</span>
            </button>
            <button
              onClick={() => navigate("/settings")}
              className="flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-lg transition-all text-muted-foreground hover:text-foreground"
            >
              <User className="h-5 w-5" />
              <span className="text-[10px] font-medium">Profile</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
