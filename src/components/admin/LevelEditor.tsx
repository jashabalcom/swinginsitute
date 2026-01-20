import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminLevel } from "@/hooks/useAdminAcademy";

const ICONS = [
  { value: "book", label: "Book" },
  { value: "brain", label: "Brain" },
  { value: "target", label: "Target" },
  { value: "trophy", label: "Trophy" },
  { value: "star", label: "Star" },
  { value: "zap", label: "Zap" },
  { value: "flame", label: "Flame" },
  { value: "gem", label: "Gem" },
];

const TIERS = [
  { value: "member", label: "Member" },
  { value: "pro", label: "Pro" },
  { value: "elite", label: "Elite" },
];

interface LevelEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level?: AdminLevel | null;
  onSave: (data: Partial<AdminLevel>) => Promise<boolean>;
}

export function LevelEditor({ open, onOpenChange, level, onSave }: LevelEditorProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("book");
  const [isLocked, setIsLocked] = useState(false);
  const [requiredTiers, setRequiredTiers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (level) {
      setTitle(level.title);
      setSlug(level.slug);
      setDescription(level.description || "");
      setIcon(level.icon || "book");
      setIsLocked(level.is_locked);
      setRequiredTiers(level.required_tiers || []);
    } else {
      setTitle("");
      setSlug("");
      setDescription("");
      setIcon("book");
      setIsLocked(false);
      setRequiredTiers([]);
    }
  }, [level, open]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!level) {
      setSlug(generateSlug(value));
    }
  };

  const toggleTier = (tier: string) => {
    setRequiredTiers((prev) =>
      prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const success = await onSave({
      title,
      slug,
      description: description || null,
      icon,
      is_locked: isLocked,
      required_tiers: requiredTiers,
    });

    setSaving(false);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{level ? "Edit Level" : "Create Level"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g., Mental Mastery"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g., mental-mastery"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will students learn in this level?"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ICONS.map((i) => (
                  <SelectItem key={i.value} value={i.value}>
                    {i.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="locked">Locked by default</Label>
            <Switch
              id="locked"
              checked={isLocked}
              onCheckedChange={setIsLocked}
            />
          </div>

          {isLocked && (
            <div className="space-y-2">
              <Label>Required Tiers (select at least one)</Label>
              <div className="flex flex-wrap gap-3">
                {TIERS.map((tier) => (
                  <label
                    key={tier.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={requiredTiers.includes(tier.value)}
                      onCheckedChange={() => toggleTier(tier.value)}
                    />
                    <span className="text-sm">{tier.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : level ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
