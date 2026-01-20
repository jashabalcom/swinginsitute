import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";

interface GoHighLevelCalendarProps {
  calendarId: string;
  height?: string;
  title?: string;
}

/**
 * GoHighLevel Calendar Embed Component
 * 
 * Calendar IDs:
 * - Parent Call: xxNZzagjCWL70aXHBopO
 * - Mindset Coaching: gh6w28zo1gVh7KDUAYBX
 */
export function GoHighLevelCalendar({ 
  calendarId, 
  height = "700px",
  title = "Book Your Call"
}: GoHighLevelCalendarProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Load GHL embed script
  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://link.msgsndr.com/js/embed.js"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://link.msgsndr.com/js/embed.js";
      script.type = "text/javascript";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  if (!calendarId) {
    return (
      <div className="w-full flex flex-col items-center justify-center bg-muted/20 rounded-xl p-8" style={{ minHeight: height }}>
        <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-center">
          Calendar not configured. Contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-card">
      {isLoading && (
        <div className="absolute inset-0 bg-card z-10">
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              <Skeleton className="h-10 rounded-lg" />
              <Skeleton className="h-10 rounded-lg" />
              <Skeleton className="h-10 rounded-lg" />
              <Skeleton className="h-10 rounded-lg" />
            </div>
          </div>
        </div>
      )}
      <iframe
        src={`https://api.leadconnectorhq.com/widget/booking/${calendarId}`}
        style={{ 
          width: "100%", 
          height, 
          border: "none",
          display: "block",
          background: "transparent"
        }}
        scrolling="no"
        title={title}
        id="msgsndr-calendar"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}

// Alternative component for direct calendar links (opens in new tab or modal)
interface GoHighLevelLinkProps {
  calendarId: string;
  children: React.ReactNode;
  className?: string;
}

export function GoHighLevelLink({ calendarId, children, className }: GoHighLevelLinkProps) {
  const url = `https://api.leadconnectorhq.com/widget/booking/${calendarId}`;
  
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
