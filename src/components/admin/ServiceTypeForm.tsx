import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type ServiceType = Tables<"service_types">;

interface ServiceTypeFormProps {
  serviceType?: ServiceType | null;
  onSubmit: (data: TablesInsert<"service_types">) => Promise<{ error: any }>;
  onCancel: () => void;
}

export function ServiceTypeForm({ serviceType, onSubmit, onCancel }: ServiceTypeFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: serviceType?.name || "",
    description: serviceType?.description || "",
    service_type: (serviceType?.service_type || "lesson") as "lesson" | "class" | "camp" | "assessment",
    duration_minutes: serviceType?.duration_minutes || 60,
    base_price: serviceType?.base_price || 0,
    member_price: serviceType?.member_price || 0,
    max_participants: serviceType?.max_participants || 1,
    is_active: serviceType?.is_active ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await onSubmit({
      ...formData,
    });

    setLoading(false);
    if (!error) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Private Lesson"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="service_type">Type</Label>
          <Select
            value={formData.service_type}
            onValueChange={(value: "lesson" | "class" | "camp" | "assessment") => 
              setFormData({ ...formData, service_type: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lesson">Lesson</SelectItem>
              <SelectItem value="class">Class</SelectItem>
              <SelectItem value="camp">Camp</SelectItem>
              <SelectItem value="assessment">Assessment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            min="15"
            step="15"
            value={formData.duration_minutes}
            onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 60 })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_participants">Max Participants</Label>
          <Input
            id="max_participants"
            type="number"
            min="1"
            value={formData.max_participants}
            onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) || 1 })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="base_price">Base Price ($)</Label>
          <Input
            id="base_price"
            type="number"
            min="0"
            step="0.01"
            value={formData.base_price}
            onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="member_price">Member Price ($)</Label>
          <Input
            id="member_price"
            type="number"
            min="0"
            step="0.01"
            value={formData.member_price}
            onChange={(e) => setFormData({ ...formData, member_price: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe this service type..."
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {serviceType ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
