import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type {
  ServiceType,
  PurchasedPackage,
  Booking,
  TimeSlot,
} from "@/types/booking";

export function useBooking() {
  const { user, profile } = useAuth();
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [packages, setPackages] = useState<PurchasedPackage[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServiceTypes = useCallback(async () => {
    const { data, error } = await supabase
      .from("service_types")
      .select("*")
      .eq("is_active", true)
      .order("created_at");

    if (error) {
      console.error("Error fetching service types:", error);
    } else {
      setServiceTypes((data as unknown as ServiceType[]) || []);
    }
  }, []);

  const fetchUserPackages = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("purchased_packages")
      .select("*, package:packages(*)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("expires_at", { ascending: true });

    if (error) {
      console.error("Error fetching packages:", error);
    } else {
      setPackages((data as unknown as PurchasedPackage[]) || []);
    }
  }, [user]);

  const fetchUserBookings = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("bookings")
      .select("*, service_type:service_types(*)")
      .eq("user_id", user.id)
      .order("start_time", { ascending: true });

    if (error) {
      console.error("Error fetching bookings:", error);
    } else {
      setBookings((data as unknown as Booking[]) || []);
    }
  }, [user]);

  const getAvailability = useCallback(
    async (date: string, coachId?: string, serviceTypeId?: string): Promise<TimeSlot[]> => {
      try {
        const { data, error } = await supabase.functions.invoke("get-availability", {
          body: { date, coachId, serviceTypeId },
        });

        if (error) throw error;
        return data?.slots || [];
      } catch (err) {
        console.error("Error getting availability:", err);
        return [];
      }
    },
    []
  );

  const createBooking = useCallback(
    async (bookingData: {
      serviceTypeId: string;
      coachId: string;
      startTime: string;
      endTime: string;
      paymentMethod: "credits" | "package" | "direct_pay";
      purchasedPackageId?: string;
      amountPaid?: number;
      stripePaymentId?: string;
      notes?: string;
    }) => {
      try {
        const { data, error } = await supabase.functions.invoke("create-booking", {
          body: bookingData,
        });

        if (error) throw error;
        if (data?.error) throw new Error(data.error);

        // Refresh bookings and packages
        await Promise.all([fetchUserBookings(), fetchUserPackages()]);

        return { booking: data?.booking, error: null };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create booking";
        return { booking: null, error: message };
      }
    },
    [fetchUserBookings, fetchUserPackages]
  );

  const cancelBooking = useCallback(
    async (bookingId: string) => {
      try {
        const { error } = await supabase
          .from("bookings")
          .update({
            status: "cancelled" as const,
            cancelled_at: new Date().toISOString(),
          })
          .eq("id", bookingId)
          .eq("user_id", user?.id);

        if (error) throw error;

        await fetchUserBookings();
        return { error: null };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to cancel booking";
        return { error: message };
      }
    },
    [user, fetchUserBookings]
  );

  const createCheckout = useCallback(
    async (priceId: string, mode: "payment" | "subscription" = "payment") => {
      try {
        const { data, error } = await supabase.functions.invoke("create-checkout", {
          body: {
            priceId,
            mode,
            successUrl: `${window.location.origin}/my-bookings?success=true`,
            cancelUrl: `${window.location.origin}/packages?canceled=true`,
          },
        });

        if (error) throw error;
        if (data?.error) throw new Error(data.error);

        return { url: data?.url, error: null };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create checkout";
        return { url: null, error: message };
      }
    },
    []
  );

  const isMember = profile?.membership_tier && profile.membership_tier !== "starter";

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        await Promise.all([
          fetchServiceTypes(),
          fetchUserPackages(),
          fetchUserBookings(),
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load booking data");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user, fetchServiceTypes, fetchUserPackages, fetchUserBookings]);

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.start_time) > new Date() && b.status !== "cancelled"
  );

  const pastBookings = bookings.filter(
    (b) => new Date(b.start_time) <= new Date() || b.status === "cancelled"
  );

  const activePackages = packages.filter(
    (p) => p.status === "active" && new Date(p.expires_at) > new Date()
  );

  return {
    serviceTypes,
    packages: activePackages,
    allPackages: packages,
    bookings,
    upcomingBookings,
    pastBookings,
    loading,
    error,
    isMember,
    getAvailability,
    createBooking,
    cancelBooking,
    createCheckout,
    refreshBookings: fetchUserBookings,
    refreshPackages: fetchUserPackages,
  };
}
