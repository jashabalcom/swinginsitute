import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Crown,
  ArrowRight,
  KeyRound,
  Loader2,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const tierBadgeColors: Record<string, string> = {
  starter: "tier-starter",
  pro: "tier-pro",
  elite: "tier-elite",
  hybrid: "tier-hybrid",
};

const playerLevels = [
  { value: "youth", label: "Youth (8-12)" },
  { value: "middle_school", label: "Middle School" },
  { value: "high_school", label: "High School" },
  { value: "college", label: "College" },
  { value: "adult", label: "Adult/Rec" },
  { value: "professional", label: "Professional" },
];

export default function Settings() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile, loading, isOnboardingComplete } = useAuth();
  const { toast } = useToast();

  const [saving, setSaving] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);

  // Form state
  const [playerName, setPlayerName] = useState("");
  const [playerAge, setPlayerAge] = useState<string>("");
  const [playerLevel, setPlayerLevel] = useState("");

  // Password form state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!loading && !isOnboardingComplete) {
      navigate("/onboarding");
    }
  }, [loading, isOnboardingComplete, navigate]);

  useEffect(() => {
    if (profile) {
      setPlayerName(profile.player_name || profile.full_name || "");
      setPlayerAge(profile.player_age?.toString() || "");
      setPlayerLevel(profile.player_level || "");
      setCurrentAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          player_name: playerName.trim() || null,
          player_age: playerAge ? parseInt(playerAge) : null,
          player_level: playerLevel || null,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      await refreshProfile();
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      setShowPasswordDialog(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: "Error",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAvatarChange = (url: string | null) => {
    setCurrentAvatarUrl(url);
    refreshProfile();
  };

  if (loading || !isOnboardingComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const memberName = profile?.player_name || profile?.full_name || "Member";
  const tier = profile?.membership_tier || "starter";
  const lessonRate = profile?.lesson_rate || 145;
  const creditsRemaining = profile?.credits_remaining || 0;
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link to="/dashboard">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </motion.div>

          {/* Profile Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-premium p-8 mb-6"
          >
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              Profile
            </h2>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <AvatarUpload
                userId={user?.id || ""}
                currentAvatarUrl={currentAvatarUrl}
                displayName={memberName}
                onAvatarChange={handleAvatarChange}
                size="lg"
              />

              <div className="flex-1 text-center md:text-left">
                <h3 className="font-display text-xl font-bold text-foreground">
                  {memberName}
                </h3>
                <p className="text-muted-foreground mt-1">
                  Member since {memberSince}
                </p>
                <div className="mt-3">
                  <span className={`tier-badge ${tierBadgeColors[tier]}`}>
                    {tier.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Player Information */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-premium p-8 mb-6"
          >
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              Player Information
            </h2>

            <div className="space-y-6">
              <div>
                <Label htmlFor="playerName">Player Name</Label>
                <Input
                  id="playerName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter player name"
                  className="mt-2 bg-muted border-border"
                />
              </div>

              <div>
                <Label htmlFor="playerAge">Player Age</Label>
                <Input
                  id="playerAge"
                  type="number"
                  min="5"
                  max="99"
                  value={playerAge}
                  onChange={(e) => setPlayerAge(e.target.value)}
                  placeholder="Enter age"
                  className="mt-2 bg-muted border-border"
                />
              </div>

              <div>
                <Label htmlFor="playerLevel">Player Level</Label>
                <Select value={playerLevel} onValueChange={setPlayerLevel}>
                  <SelectTrigger className="mt-2 bg-muted border-border">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {playerLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </motion.section>

          {/* Account Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-premium p-8 mb-6"
          >
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              Account
            </h2>

            <div className="space-y-6">
              <div>
                <Label>Email</Label>
                <Input
                  value={user?.email || ""}
                  disabled
                  className="mt-2 bg-muted/50 border-border text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Contact support to change your email address
                </p>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowPasswordDialog(true)}
                className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
              >
                <KeyRound className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </div>
          </motion.section>

          {/* Membership Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-premium p-8"
          >
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              Membership
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tier</span>
                <span className={`tier-badge ${tierBadgeColors[tier]}`}>
                  {tier.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Lesson Rate</span>
                <span className="text-foreground font-semibold">
                  ${lessonRate}/hr
                </span>
              </div>
              {tier === "hybrid" && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Credits</span>
                  <span className="text-foreground font-semibold">
                    {creditsRemaining} remaining
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Feedback</span>
                <span className="text-foreground font-semibold capitalize">
                  {profile?.feedback_frequency || "Weekly"}
                </span>
              </div>

              {tier !== "elite" && (
                <div className="pt-6 border-t border-border">
                  <Link to="/train-online">
                    <Button className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade Membership
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </main>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">Change Password</DialogTitle>
            <DialogDescription>
              Enter your new password below. Must be at least 6 characters.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="mt-2 bg-muted border-border"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="mt-2 bg-muted border-border"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowPasswordDialog(false)}
              className="text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={passwordLoading || !newPassword || !confirmPassword}
              className="bg-primary hover:bg-primary/90"
            >
              {passwordLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
