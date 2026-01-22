import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { startOfDay, endOfDay, addDays, format } from "date-fns";

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  content: string | null;
  created_at: string;
  metadata: Record<string, any> | null;
}

interface DashboardMetrics {
  totalRevenue: number;
  activeMembers: number;
  upcomingBookings: number;
  pendingReviews: number;
  packagesSold: number;
  activeServices: number;
  todayBookings: number;
  recentBookings: Array<{
    id: string;
    start_time: string;
    status: string;
    user_id: string;
  }>;
  recentActivity: RecentActivity[];
}

export function useAdminDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalRevenue: 0,
    activeMembers: 0,
    upcomingBookings: 0,
    pendingReviews: 0,
    packagesSold: 0,
    activeServices: 0,
    todayBookings: 0,
    recentBookings: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAndFetch = async () => {
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

      const today = new Date();
      const todayStart = startOfDay(today).toISOString();
      const todayEnd = endOfDay(today).toISOString();
      const weekEnd = endOfDay(addDays(today, 7)).toISOString();

      // Fetch all metrics in parallel
      const [
        revenueResult,
        membersResult,
        upcomingResult,
        reviewsResult,
        packagesResult,
        servicesResult,
        todayResult,
        activityResult,
      ] = await Promise.all([
        // Total revenue from completed bookings
        supabase
          .from("bookings")
          .select("amount_paid")
          .eq("status", "completed"),
        
        // Active members count
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true }),
        
        // Upcoming bookings (next 7 days)
        supabase
          .from("bookings")
          .select("id", { count: "exact", head: true })
          .gte("start_time", todayStart)
          .lte("start_time", weekEnd)
          .in("status", ["pending", "confirmed"]),
        
        // Pending video reviews
        supabase
          .from("video_submissions")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
        
        // Packages sold (active)
        supabase
          .from("purchased_packages")
          .select("id", { count: "exact", head: true })
          .eq("status", "active"),
        
        // Active service types
        supabase
          .from("service_types")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true),
        
        // Today's bookings
        supabase
          .from("bookings")
          .select("id, start_time, status, user_id")
          .gte("start_time", todayStart)
          .lte("start_time", todayEnd)
          .order("start_time", { ascending: true }),
        
        // Recent activity (admin notifications)
        supabase
          .from("notifications")
          .select("id, type, title, content, created_at, metadata")
          .eq("user_id", user.id)
          .in("type", ["new_user", "new_post", "new_comment", "new_dm"])
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      // Calculate total revenue
      const totalRevenue = revenueResult.data?.reduce(
        (sum, b) => sum + (b.amount_paid || 0),
        0
      ) || 0;

      setMetrics({
        totalRevenue,
        activeMembers: membersResult.count || 0,
        upcomingBookings: upcomingResult.count || 0,
        pendingReviews: reviewsResult.count || 0,
        packagesSold: packagesResult.count || 0,
        activeServices: servicesResult.count || 0,
        todayBookings: todayResult.data?.length || 0,
        recentBookings: todayResult.data || [],
        recentActivity: (activityResult.data || []).map(item => ({
          ...item,
          metadata: item.metadata as Record<string, any> | null,
        })),
      });

      setLoading(false);
    };

    checkAdminAndFetch();
  }, [user]);

  return { metrics, loading, isAdmin };
}
