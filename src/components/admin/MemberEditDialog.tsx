import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MemberProfile } from "@/hooks/useAdminMembers";

interface MemberEditDialogProps {
  member: MemberProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (userId: string, updates: Partial<MemberProfile>) => Promise<{ error: string | null }>;
}

const membershipTiers = ["starter", "pro", "elite", "hybrid"];
const playerLevels = ["beginner", "intermediate", "advanced", "elite"];

export function MemberEditDialog({
  member,
  open,
  onOpenChange,
  onSave,
}: MemberEditDialogProps) {
  const [formData, setFormData] = useState<Partial<MemberProfile>>({});
  const [saving, setSaving] = useState(false);

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && member) {
      setFormData({
        full_name: member.full_name,
        player_name: member.player_name,
        player_level: member.player_level,
        player_age: member.player_age,
        membership_tier: member.membership_tier,
        credits_remaining: member.credits_remaining,
        lesson_rate: member.lesson_rate,
      });
    }
    onOpenChange(isOpen);
  };

  const handleSave = async () => {
    if (!member) return;
    setSaving(true);
    await onSave(member.user_id, formData);
    setSaving(false);
    onOpenChange(false);
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Member Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="player_name">Player Name</Label>
              <Input
                id="player_name"
                value={formData.player_name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, player_name: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="player_age">Player Age</Label>
              <Input
                id="player_age"
                type="number"
                value={formData.player_age || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    player_age: parseInt(e.target.value) || null,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="player_level">Player Level</Label>
              <Select
                value={formData.player_level || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, player_level: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {playerLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="membership_tier">Membership Tier</Label>
              <Select
                value={formData.membership_tier || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, membership_tier: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  {membershipTiers.map((tier) => (
                    <SelectItem key={tier} value={tier}>
                      {tier.charAt(0).toUpperCase() + tier.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lesson_rate">Lesson Rate ($)</Label>
              <Input
                id="lesson_rate"
                type="number"
                value={formData.lesson_rate || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lesson_rate: parseFloat(e.target.value) || null,
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="credits_remaining">Credits Remaining</Label>
            <Input
              id="credits_remaining"
              type="number"
              value={formData.credits_remaining || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  credits_remaining: parseInt(e.target.value) || null,
                })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
