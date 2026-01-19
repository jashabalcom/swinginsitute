import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Search,
  Edit,
  Shield,
  Crown,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminMembers, MemberProfile } from "@/hooks/useAdminMembers";
import { MemberEditDialog } from "@/components/admin/MemberEditDialog";
import { RoleManageDialog } from "@/components/admin/RoleManageDialog";
import { format } from "date-fns";

const tierColors: Record<string, string> = {
  starter: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  pro: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  elite: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  hybrid: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const roleIcons: Record<string, typeof Shield> = {
  admin: Crown,
  coach: Shield,
  member: User,
};

export default function AdminMembers() {
  const navigate = useNavigate();
  const {
    members,
    loading,
    isAdmin,
    updateProfile,
    assignRole,
    removeRole,
  } = useAdminMembers();

  const [searchQuery, setSearchQuery] = useState("");
  const [editingMember, setEditingMember] = useState<MemberProfile | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [rolesMember, setRolesMember] = useState<MemberProfile | null>(null);
  const [rolesDialogOpen, setRolesDialogOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading members...</div>
      </div>
    );
  }

  if (!isAdmin) {
    navigate("/dashboard");
    return null;
  }

  const filteredMembers = members.filter((member) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      member.full_name?.toLowerCase().includes(searchLower) ||
      member.player_name?.toLowerCase().includes(searchLower) ||
      member.user_id.toLowerCase().includes(searchLower)
    );
  });

  const handleEditClick = (member: MemberProfile) => {
    setEditingMember(member);
    setEditDialogOpen(true);
  };

  const handleRolesClick = (member: MemberProfile) => {
    setRolesMember(member);
    setRolesDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-8 border-b border-border mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-8 h-8 text-amber-500" />
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    Member Management
                  </h1>
                </div>
                <p className="text-muted-foreground">
                  {members.length} total members
                </p>
              </div>
              <Link to="/admin">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Admin
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>

          {/* Members Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>All Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Player Name</TableHead>
                        <TableHead>Tier</TableHead>
                        <TableHead>Roles</TableHead>
                        <TableHead>Onboarded</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">
                            {member.full_name || "—"}
                          </TableCell>
                          <TableCell>
                            {member.player_name || "—"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                tierColors[member.membership_tier || "starter"]
                              }
                            >
                              {(member.membership_tier || "starter").toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {member.roles.length === 0 ? (
                                <span className="text-muted-foreground text-sm">None</span>
                              ) : (
                                member.roles.map((role) => {
                                  const Icon = roleIcons[role] || User;
                                  return (
                                    <Badge
                                      key={role}
                                      variant="outline"
                                      className="text-xs flex items-center gap-1"
                                    >
                                      <Icon className="w-3 h-3" />
                                      {role}
                                    </Badge>
                                  );
                                })
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {member.onboarding_completed ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-muted-foreground" />
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {format(new Date(member.created_at), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick(member)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRolesClick(member)}
                              >
                                <Shield className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredMembers.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center text-muted-foreground py-8"
                          >
                            No members found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Edit Dialog */}
      <MemberEditDialog
        member={editingMember}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={updateProfile}
      />

      {/* Roles Dialog */}
      <RoleManageDialog
        member={rolesMember}
        open={rolesDialogOpen}
        onOpenChange={setRolesDialogOpen}
        onAssignRole={assignRole}
        onRemoveRole={removeRole}
      />
    </div>
  );
}
