import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  CalendarOff, 
  Users, 
  ArrowLeft,
  LayoutDashboard,
  Settings,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminSchedule } from "@/hooks/useAdminSchedule";
import { AvailabilityEditor } from "@/components/admin/AvailabilityEditor";
import { BlockedTimesManager } from "@/components/admin/BlockedTimesManager";
import { AdminBookingsCalendar } from "@/components/admin/AdminBookingsCalendar";

// Default coach ID - in a full system, this would come from a selector
const DEFAULT_COACH_ID = "00000000-0000-0000-0000-000000000001";

export default function AdminSchedule() {
  const { user } = useAuth();
  const {
    availability,
    blockedTimes,
    allBookings,
    upcomingBookings,
    todaysBookings,
    loading,
    isAdmin,
    addAvailability,
    deleteAvailability,
    addBlockedTime,
    deleteBlockedTime,
    updateBookingStatus,
  } = useAdminSchedule();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-12 container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to view this page.
          </p>
          <Link to="/dashboard" className="text-primary hover:underline">
            Back to Dashboard
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link to="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
                <Settings className="w-8 h-8 text-primary" />
                Schedule Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage availability, block times, and view all bookings
              </p>
            </div>
            <Link to="/admin/services">
              <Button variant="outline">
                <DollarSign className="mr-2 h-4 w-4" />
                Manage Services
              </Button>
            </Link>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          >
            <div className="card-premium p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{todaysBookings.length}</div>
                <div className="text-sm text-muted-foreground">Today's Bookings</div>
              </div>
            </div>
            <div className="card-premium p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-secondary/10">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{upcomingBookings.length}</div>
                <div className="text-sm text-muted-foreground">Upcoming Bookings</div>
              </div>
            </div>
            <div className="card-premium p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10">
                <CalendarOff className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{blockedTimes.length}</div>
                <div className="text-sm text-muted-foreground">Blocked Times</div>
              </div>
            </div>
          </motion.div>

          {/* Main Tabs */}
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="mb-6 bg-muted/50 p-1">
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Bookings Calendar
              </TabsTrigger>
              <TabsTrigger value="availability" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Weekly Availability
              </TabsTrigger>
              <TabsTrigger value="blocked" className="flex items-center gap-2">
                <CalendarOff className="w-4 h-4" />
                Blocked Times
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card-premium p-6"
              >
                <AdminBookingsCalendar
                  bookings={allBookings}
                  onUpdateStatus={updateBookingStatus}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="availability">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card-premium p-6"
              >
                <h2 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Weekly Recurring Availability
                </h2>
                <p className="text-muted-foreground mb-6">
                  Set the hours when bookings are available each week. These times repeat weekly.
                </p>
                <AvailabilityEditor
                  availability={availability}
                  coachId={user?.id || DEFAULT_COACH_ID}
                  onAdd={addAvailability}
                  onDelete={deleteAvailability}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="blocked">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card-premium p-6"
              >
                <h2 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <CalendarOff className="w-5 h-5 text-destructive" />
                  Block Off Times
                </h2>
                <p className="text-muted-foreground mb-6">
                  Block specific dates and times when you're unavailable (vacation, tournaments, etc.)
                </p>
                <BlockedTimesManager
                  blockedTimes={blockedTimes}
                  coachId={user?.id || DEFAULT_COACH_ID}
                  onAdd={addBlockedTime}
                  onDelete={deleteBlockedTime}
                />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
