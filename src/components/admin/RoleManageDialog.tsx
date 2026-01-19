import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Shield, Crown, User } from "lucide-react";
import { MemberProfile } from "@/hooks/useAdminMembers";

interface RoleManageDialogProps {
  member: MemberProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssignRole: (userId: string, role: "admin" | "coach" | "member") => Promise<{ error: string | null }>;
  onRemoveRole: (userId: string, role: "admin" | "coach" | "member") => Promise<{ error: string | null }>;
}

const availableRoles: { role: "admin" | "coach" | "member"; label: string; icon: typeof Shield; color: string }[] = [
  { role: "admin", label: "Admin", icon: Crown, color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  { role: "coach", label: "Coach", icon: Shield, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { role: "member", label: "Member", icon: User, color: "bg-green-500/20 text-green-400 border-green-500/30" },
];

export function RoleManageDialog({
  member,
  open,
  onOpenChange,
  onAssignRole,
  onRemoveRole,
}: RoleManageDialogProps) {
  const [loading, setLoading] = useState<string | null>(null);

  if (!member) return null;

  const handleAssign = async (role: "admin" | "coach" | "member") => {
    setLoading(role);
    await onAssignRole(member.user_id, role);
    setLoading(null);
  };

  const handleRemove = async (role: "admin" | "coach" | "member") => {
    setLoading(role);
    await onRemoveRole(member.user_id, role);
    setLoading(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Roles</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Managing roles for:{" "}
            <span className="font-medium text-foreground">
              {member.player_name || member.full_name || "Unknown Member"}
            </span>
          </p>

          {/* Current Roles */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-foreground mb-3">Current Roles</h4>
            <div className="flex flex-wrap gap-2">
              {member.roles.length === 0 ? (
                <span className="text-sm text-muted-foreground">No roles assigned</span>
              ) : (
                member.roles.map((role) => {
                  const typedRole = role as "admin" | "coach" | "member";
                  const roleInfo = availableRoles.find((r) => r.role === typedRole);
                  const Icon = roleInfo?.icon || User;
                  return (
                    <Badge
                      key={role}
                      variant="outline"
                      className={`${roleInfo?.color || ""} flex items-center gap-1.5 pr-1`}
                    >
                      <Icon className="w-3 h-3" />
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                      <button
                        onClick={() => handleRemove(typedRole)}
                        disabled={loading === role}
                        className="ml-1 p-0.5 hover:bg-white/10 rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  );
                })
              )}
            </div>
          </div>

          {/* Available Roles to Add */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Add Role</h4>
            <div className="flex flex-wrap gap-2">
              {availableRoles
                .filter((r) => !member.roles.includes(r.role))
                .map((roleInfo) => {
                  const Icon = roleInfo.icon;
                  return (
                    <Button
                      key={roleInfo.role}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAssign(roleInfo.role)}
                      disabled={loading === roleInfo.role}
                      className="flex items-center gap-1.5"
                    >
                      <Plus className="w-3 h-3" />
                      <Icon className="w-3 h-3" />
                      {roleInfo.label}
                    </Button>
                  );
                })}
              {availableRoles.every((r) => member.roles.includes(r.role)) && (
                <span className="text-sm text-muted-foreground">All roles assigned</span>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
