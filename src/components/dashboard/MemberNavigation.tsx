import { Link, useLocation } from "react-router-dom";
import { Home, GraduationCap, Calendar, Users, CalendarPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "home", label: "Home", icon: Home, href: "/dashboard" },
  { id: "academy", label: "Academy", icon: GraduationCap, href: "/academy" },
  { id: "events", label: "Events", icon: Calendar, href: "/events" },
  { id: "community", label: "Community", icon: Users, href: "/training-room" },
  { id: "book", label: "Book", icon: CalendarPlus, href: "/book" },
];

export function MemberNavigation() {
  const location = useLocation();
  
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Sub-Navigation */}
      <nav className="hidden lg:flex items-center gap-1 border-b border-border mb-6 -mt-2">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.href}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
              isActive(item.href)
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border pb-safe">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              className={cn(
                "flex flex-col items-center p-2 min-w-0",
                isActive(item.href)
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1 truncate">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
