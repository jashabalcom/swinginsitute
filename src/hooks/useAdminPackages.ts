import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface Package {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  member_price: number;
  savings_amount: number | null;
  session_count: number;
  validity_days: number;
  service_type_id: string | null;
  is_active: boolean;
  created_at: string;
  service_type?: {
    id: string;
    name: string;
  } | null;
}

export interface PackageFormData {
  name: string;
  description: string;
  base_price: number;
  member_price: number;
  savings_amount: number;
  session_count: number;
  validity_days: number;
  service_type_id: string | null;
  is_active: boolean;
}

export function useAdminPackages() {
  const { user } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [serviceTypes, setServiceTypes] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchPackages = async () => {
    if (!user) return;

    // Check admin status
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

    // Fetch packages with service type info
    const { data: packagesData, error: packagesError } = await supabase
      .from("packages")
      .select(`
        *,
        service_type:service_types(id, name)
      `)
      .order("created_at", { ascending: false });

    if (packagesError) {
      toast({
        title: "Error",
        description: "Failed to fetch packages",
        variant: "destructive",
      });
    } else {
      setPackages(packagesData || []);
    }

    // Fetch service types for dropdown
    const { data: serviceData } = await supabase
      .from("service_types")
      .select("id, name")
      .eq("is_active", true)
      .order("name");

    setServiceTypes(serviceData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPackages();
  }, [user]);

  const createPackage = async (data: PackageFormData) => {
    const { error } = await supabase.from("packages").insert({
      name: data.name,
      description: data.description || null,
      base_price: data.base_price,
      member_price: data.member_price,
      savings_amount: data.savings_amount || null,
      session_count: data.session_count,
      validity_days: data.validity_days,
      service_type_id: data.service_type_id || null,
      is_active: data.is_active,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create package",
        variant: "destructive",
      });
      return { error: error.message };
    }

    toast({
      title: "Success",
      description: "Package created successfully",
    });

    await fetchPackages();
    return { error: null };
  };

  const updatePackage = async (id: string, data: Partial<PackageFormData>) => {
    const { error } = await supabase
      .from("packages")
      .update({
        name: data.name,
        description: data.description || null,
        base_price: data.base_price,
        member_price: data.member_price,
        savings_amount: data.savings_amount || null,
        session_count: data.session_count,
        validity_days: data.validity_days,
        service_type_id: data.service_type_id || null,
        is_active: data.is_active,
      })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update package",
        variant: "destructive",
      });
      return { error: error.message };
    }

    toast({
      title: "Success",
      description: "Package updated successfully",
    });

    await fetchPackages();
    return { error: null };
  };

  const deletePackage = async (id: string) => {
    const { error } = await supabase.from("packages").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete package",
        variant: "destructive",
      });
      return { error: error.message };
    }

    toast({
      title: "Success",
      description: "Package deleted successfully",
    });

    await fetchPackages();
    return { error: null };
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from("packages")
      .update({ is_active: isActive })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update package status",
        variant: "destructive",
      });
      return { error: error.message };
    }

    toast({
      title: "Success",
      description: `Package ${isActive ? "activated" : "deactivated"}`,
    });

    await fetchPackages();
    return { error: null };
  };

  return {
    packages,
    serviceTypes,
    loading,
    isAdmin,
    createPackage,
    updatePackage,
    deletePackage,
    toggleActive,
    refetch: fetchPackages,
  };
}
