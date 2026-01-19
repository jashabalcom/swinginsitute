import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface MemberProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  player_name: string | null;
  player_level: string | null;
  player_age: number | null;
  membership_tier: string | null;
  credits_remaining: number | null;
  lesson_rate: number | null;
  onboarding_completed: boolean | null;
  created_at: string;
  email?: string;
  roles: string[];
}

export function useAdminMembers() {
  const { user } = useAuth();
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchMembers = async () => {
    if (!user) return;

    // Check admin status first
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setIsAdmin(true);

    // Fetch all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profilesError) {
      toast({
        title: "Error",
        description: "Failed to fetch members",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Fetch all user roles
    const { data: allRoles } = await supabase
      .from("user_roles")
      .select("user_id, role");

    // Combine profiles with their roles
    const membersWithRoles: MemberProfile[] = (profiles || []).map((profile) => ({
      ...profile,
      roles: (allRoles || [])
        .filter((r) => r.user_id === profile.user_id)
        .map((r) => r.role),
    }));

    setMembers(membersWithRoles);
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, [user]);

  const updateProfile = async (
    userId: string,
    updates: Partial<MemberProfile>
  ) => {
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: updates.full_name,
        player_name: updates.player_name,
        player_level: updates.player_level,
        player_age: updates.player_age,
        membership_tier: updates.membership_tier,
        credits_remaining: updates.credits_remaining,
        lesson_rate: updates.lesson_rate,
      })
      .eq("user_id", userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      return { error: error.message };
    }

    toast({
      title: "Success",
      description: "Profile updated successfully",
    });

    await fetchMembers();
    return { error: null };
  };

  const assignRole = async (userId: string, role: "admin" | "coach" | "member") => {
    // Check if role already exists
    const { data: existing } = await supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .eq("role", role)
      .maybeSingle();

    if (existing) {
      toast({
        title: "Info",
        description: `User already has the ${role} role`,
      });
      return { error: null };
    }

    const { error } = await supabase.from("user_roles").insert({
      user_id: userId,
      role: role,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to assign role",
        variant: "destructive",
      });
      return { error: error.message };
    }

    toast({
      title: "Success",
      description: `${role} role assigned successfully`,
    });

    await fetchMembers();
    return { error: null };
  };

  const removeRole = async (userId: string, role: "admin" | "coach" | "member") => {
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", role);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove role",
        variant: "destructive",
      });
      return { error: error.message };
    }

    toast({
      title: "Success",
      description: `${role} role removed successfully`,
    });

    await fetchMembers();
    return { error: null };
  };

  return {
    members,
    loading,
    isAdmin,
    updateProfile,
    assignRole,
    removeRole,
    refetch: fetchMembers,
  };
}
