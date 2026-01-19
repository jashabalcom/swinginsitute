import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type ServiceType = Tables<"service_types">;
type ServiceTypeInsert = TablesInsert<"service_types">;
type ServiceTypeUpdate = TablesUpdate<"service_types">;

export function useAdminServiceTypes() {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchServiceTypes = async () => {
    try {
      const { data, error } = await supabase
        .from("service_types")
        .select("*")
        .order("name");

      if (error) throw error;
      setServiceTypes(data || []);
    } catch (error: any) {
      console.error("Error fetching service types:", error);
      toast({
        title: "Error",
        description: "Failed to load service types",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceTypes();
  }, []);

  const createServiceType = async (serviceType: ServiceTypeInsert) => {
    try {
      const { error } = await supabase
        .from("service_types")
        .insert(serviceType);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Service type created successfully",
      });
      fetchServiceTypes();
      return { error: null };
    } catch (error: any) {
      console.error("Error creating service type:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create service type",
        variant: "destructive",
      });
      return { error };
    }
  };

  const updateServiceType = async (id: string, updates: ServiceTypeUpdate) => {
    try {
      const { error } = await supabase
        .from("service_types")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Service type updated successfully",
      });
      fetchServiceTypes();
      return { error: null };
    } catch (error: any) {
      console.error("Error updating service type:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update service type",
        variant: "destructive",
      });
      return { error };
    }
  };

  const deleteServiceType = async (id: string) => {
    try {
      const { error } = await supabase
        .from("service_types")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Service type deleted successfully",
      });
      fetchServiceTypes();
      return { error: null };
    } catch (error: any) {
      console.error("Error deleting service type:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete service type",
        variant: "destructive",
      });
      return { error };
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    return updateServiceType(id, { is_active: isActive });
  };

  return {
    serviceTypes,
    loading,
    createServiceType,
    updateServiceType,
    deleteServiceType,
    toggleActive,
    refetch: fetchServiceTypes,
  };
}
