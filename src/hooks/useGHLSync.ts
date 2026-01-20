import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for syncing data with GoHighLevel CRM
 */
export function useGHLSync() {
  const syncSignup = async (email: string, name?: string, phone?: string, source = "Website Signup") => {
    try {
      const { data, error } = await supabase.functions.invoke("ghl-sync", {
        body: {
          action: "sync_signup",
          email,
          name,
          phone,
          source,
        },
      });

      if (error) {
        console.error("[GHL] Signup sync failed:", error);
        return false;
      }

      console.log("[GHL] Signup synced successfully:", data);
      return true;
    } catch (err) {
      console.error("[GHL] Signup sync error:", err);
      return false;
    }
  };

  const syncBooking = async (email: string, name: string, serviceType: string, bookingDate: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("ghl-sync", {
        body: {
          action: "sync_booking",
          email,
          name,
          serviceType,
          bookingDate,
        },
      });

      if (error) {
        console.error("[GHL] Booking sync failed:", error);
        return false;
      }

      console.log("[GHL] Booking synced successfully:", data);
      return true;
    } catch (err) {
      console.error("[GHL] Booking sync error:", err);
      return false;
    }
  };

  const addTags = async (email: string, tags: string[]) => {
    try {
      const { data, error } = await supabase.functions.invoke("ghl-sync", {
        body: {
          action: "add_tags",
          email,
          tags,
        },
      });

      if (error) {
        console.error("[GHL] Add tags failed:", error);
        return false;
      }

      return true;
    } catch (err) {
      console.error("[GHL] Add tags error:", err);
      return false;
    }
  };

  return {
    syncSignup,
    syncBooking,
    addTags,
  };
}
