import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, PackageFormData } from "@/hooks/useAdminPackages";

interface PackageFormDialogProps {
  pkg: Package | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceTypes: { id: string; name: string }[];
  onSave: (data: PackageFormData) => Promise<{ error: string | null }>;
  onUpdate: (id: string, data: PackageFormData) => Promise<{ error: string | null }>;
}

const defaultFormData: PackageFormData = {
  name: "",
  description: "",
  base_price: 0,
  member_price: 0,
  savings_amount: 0,
  session_count: 1,
  validity_days: 90,
  service_type_id: null,
  is_active: true,
};

export function PackageFormDialog({
  pkg,
  open,
  onOpenChange,
  serviceTypes,
  onSave,
  onUpdate,
}: PackageFormDialogProps) {
  const [formData, setFormData] = useState<PackageFormData>(defaultFormData);
  const [saving, setSaving] = useState(false);

  const isEditing = !!pkg;

  useEffect(() => {
    if (open) {
      if (pkg) {
        setFormData({
          name: pkg.name,
          description: pkg.description || "",
          base_price: pkg.base_price,
          member_price: pkg.member_price,
          savings_amount: pkg.savings_amount || 0,
          session_count: pkg.session_count,
          validity_days: pkg.validity_days,
          service_type_id: pkg.service_type_id,
          is_active: pkg.is_active,
        });
      } else {
        setFormData(defaultFormData);
      }
    }
  }, [open, pkg]);

  const handleSave = async () => {
    if (!formData.name.trim()) return;

    setSaving(true);
    if (isEditing && pkg) {
      await onUpdate(pkg.id, formData);
    } else {
      await onSave(formData);
    }
    setSaving(false);
    onOpenChange(false);
  };

  // Calculate savings when prices change
  const calculateSavings = () => {
    const baseTotal = formData.base_price * formData.session_count;
    const packageTotal = formData.base_price;
    return Math.max(0, baseTotal - packageTotal);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Package" : "Create New Package"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Package Name *</Label>
            <Input
              id="name"
              placeholder="e.g., 5-Session Pack"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Package description..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          {/* Service Type */}
          <div className="space-y-2">
            <Label htmlFor="service_type">Service Type</Label>
            <Select
              value={formData.service_type_id || "none"}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  service_type_id: value === "none" ? null : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">All Services</SelectItem>
                {serviceTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Session Count */}
          <div className="space-y-2">
            <Label htmlFor="session_count">Number of Sessions *</Label>
            <Input
              id="session_count"
              type="number"
              min={1}
              value={formData.session_count}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  session_count: parseInt(e.target.value) || 1,
                })
              }
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="base_price">Base Price ($)</Label>
              <Input
                id="base_price"
                type="number"
                min={0}
                step={0.01}
                value={formData.base_price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    base_price: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member_price">Member Price ($)</Label>
              <Input
                id="member_price"
                type="number"
                min={0}
                step={0.01}
                value={formData.member_price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    member_price: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          {/* Savings Amount */}
          <div className="space-y-2">
            <Label htmlFor="savings_amount">Savings Amount ($)</Label>
            <Input
              id="savings_amount"
              type="number"
              min={0}
              step={0.01}
              placeholder="Optional: Amount saved vs individual sessions"
              value={formData.savings_amount || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  savings_amount: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>

          {/* Validity */}
          <div className="space-y-2">
            <Label htmlFor="validity_days">Validity Period (days)</Label>
            <Input
              id="validity_days"
              type="number"
              min={1}
              value={formData.validity_days}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  validity_days: parseInt(e.target.value) || 90,
                })
              }
            />
            <p className="text-xs text-muted-foreground">
              Sessions must be used within this many days of purchase
            </p>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_active">Active</Label>
              <p className="text-xs text-muted-foreground">
                Inactive packages won't be shown to customers
              </p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_active: checked })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !formData.name.trim()}>
            {saving ? "Saving..." : isEditing ? "Update Package" : "Create Package"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
