import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  DollarSign,
  Users,
  Calendar,
  Video,
  Package,
  Briefcase,
  Clock,
  UserPlus,
  CalendarPlus,
  CalendarOff,
  ArrowRight,
  LayoutDashboard,
  Settings,
  BookOpen,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { format } from "date-fns";

const kpiCards = [
  { key: "totalRevenue", label: "Total Revenue", icon: DollarSign, format: "currency" },
  { key: "activeMembers", label: "Active Members", icon: Users, format: "number" },
  { key: "upcomingBookings", label: "Upcoming (7 days)", icon: Calendar, format: "number" },
  { key: "pendingReviews", label: "Pending Reviews", icon: Video, format: "number" },
  { key: "packagesSold", label: "Active Packages", icon: Package, format: "number" },
  { key: "activeServices", label: "Service Types", icon: Briefcase, format: "number" },
] as const;

const quickActions = [
  { label: "Today's Schedule", href: "/admin/schedule", icon: Clock },
  { label: "New Booking", href: "/book", icon: CalendarPlus },
  { label: "Add Member", href: "/admin/members", icon: UserPlus },
  { label: "Block Time", href: "/admin/schedule", icon: CalendarOff },
];

const managementSections = [
  {
    title: "Schedule Management",
    description: "Manage bookings, availability, and blocked times",
    href: "/admin/schedule",
    icon: Calendar,
    color: "text-blue-500",
  },
  {
    title: "Service Types & Pricing",
    description: "Configure lessons, classes, and pricing",
    href: "/admin/services",
    icon: Settings,
    color: "text-emerald-500",
  },
  {
    title: "Lesson Packages",
    description: "Create and manage session packages",
    href: "/admin/packages",
    icon: Package,
    color: "text-purple-500",
  },
  {
    title: "Member Management",
    description: "View members, edit profiles, assign roles",
    href: "/admin/members",
    icon: Users,
    color: "text-amber-500",
  },
  {
    title: "Video Reviews",
    description: "Review swing videos and provide feedback",
    href: "/admin/videos",
    icon: Video,
    color: "text-rose-500",
  },
  {
    title: "Drill Library",
    description: "Manage training drills and phases",
    href: "/admin/drills",
    icon: BookOpen,
    color: "text-cyan-500",
  },
  {
    title: "Training Room",
    description: "Manage channels and moderate messages",
    href: "/training-room",
    icon: MessageSquare,
    color: "text-indigo-500",
  },
  {
    title: "Revenue Reports",
    description: "Financial summaries and booking analytics",
    href: "/admin/reports",
    icon: BarChart3,
    color: "text-green-500",
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { metrics, loading, isAdmin } = useAdminDashboard();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading admin dashboard...</div>
      </div>
    );
  }

  if (!isAdmin) {
    navigate("/dashboard");
    return null;
  }

  const formatValue = (key: string, value: number, formatType: string) => {
    if (formatType === "currency") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      }).format(value);
    }
    return value.toLocaleString();
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
                  <LayoutDashboard className="w-8 h-8 text-primary" />
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    Admin Dashboard
                  </h1>
                </div>
                <p className="text-muted-foreground">
                  {format(new Date(), "EEEE, MMMM d, yyyy")}
                </p>
              </div>
              <Link to="/dashboard">
                <Button variant="outline">
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* KPI Cards */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              Key Metrics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {kpiCards.map((kpi) => {
                const Icon = kpi.icon;
                const value = metrics[kpi.key as keyof typeof metrics] as number;
                return (
                  <Card key={kpi.key} className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {kpi.label}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">
                        {formatValue(kpi.key, value, kpi.format)}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.section>

          {/* Quick Actions */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.label} to={action.href}>
                    <Button
                      variant="outline"
                      className="border-primary/30 hover:border-primary hover:bg-primary/5"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {action.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </motion.section>

          {/* Today's Overview */}
          {metrics.todayBookings > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mb-8"
            >
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Today's Bookings ({metrics.todayBookings})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {metrics.recentBookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <span className="text-sm text-foreground">
                          {format(new Date(booking.start_time), "h:mm a")}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            booking.status === "confirmed"
                              ? "bg-green-500/20 text-green-400"
                              : booking.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Link to="/admin/schedule" className="block mt-4">
                    <Button variant="ghost" className="w-full">
                      View Full Schedule
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.section>
          )}

          {/* Management Sections */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              Management
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {managementSections.map((section) => {
                const Icon = section.icon;
                return (
                  <Link key={section.title} to={section.href}>
                    <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
                      <CardContent className="p-6">
                        <Icon className={`w-8 h-8 ${section.color} mb-4`} />
                        <h3 className="font-display font-semibold text-foreground mb-1">
                          {section.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {section.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
