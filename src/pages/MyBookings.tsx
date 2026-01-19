import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/hooks/useBooking";
import { BookingCard } from "@/components/booking/BookingCard";
import { UserPackageCard } from "@/components/booking/UserPackageCard";
import { useToast } from "@/hooks/use-toast";

export default function MyBookings() {
  const { user } = useAuth();
  const { upcomingBookings, pastBookings, packages, cancelBooking, loading } = useBooking();
  const { toast } = useToast();

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    
    const { error } = await cancelBooking(bookingId);
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    } else {
      toast({ title: "Booking cancelled", description: "Your booking has been cancelled." });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-12 container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Sign in to view your bookings</h1>
          <Link to="/login"><Button>Sign In</Button></Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">My Bookings</h1>
            <Link to="/book">
              <Button className="bg-primary hover:bg-primary/90">
                <Calendar className="w-4 h-4 mr-2" />
                Book Session
              </Button>
            </Link>
          </motion.div>

          {/* Packages */}
          {packages.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Active Packages
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {packages.map((pkg) => (
                  <UserPackageCard key={pkg.id} pkg={pkg} onUseCredits={() => window.location.href = "/book"} />
                ))}
              </div>
            </motion.section>
          )}

          {/* Bookings Tabs */}
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
              <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {loading ? (
                <div className="text-muted-foreground">Loading...</div>
              ) : upcomingBookings.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming bookings</p>
                  <Link to="/book" className="text-primary hover:underline mt-2 inline-block">Book a session</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} onCancel={handleCancel} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              {pastBookings.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No past bookings</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} showCancelButton={false} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
