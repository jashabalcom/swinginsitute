import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface GoHighLevelCalendarProps {
  calendarId: string;
  height?: string;
  title?: string;
}

/**
 * GoHighLevel Calendar Embed Component
 * 
 * To use this component, get the calendar ID from GoHighLevel:
 * 1. Go to GoHighLevel > Calendars
 * 2. Select the calendar you want to embed
 * 3. Click "Share" or "Embed"
 * 4. Copy the calendar ID from the embed code URL
 * 
 * Example embed URL: https://api.leadconnectorhq.com/widget/booking/YOUR_CALENDAR_ID
 */
export function GoHighLevelCalendar({ 
  calendarId, 
  height = "700px",
  title = "Book Your Call"
}: GoHighLevelCalendarProps) {
  const [isLoading, setIsLoading] = useState(true);

  if (!calendarId) {
    return (
      <div className="w-full flex items-center justify-center bg-muted/50 rounded-xl p-8" style={{ minHeight: height }}>
        <p className="text-muted-foreground text-center">
          Calendar not configured. Contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-border">
      {isLoading && (
        <div className="absolute inset-0 bg-background">
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 w-full" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
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
          display: "block"
        }}
        scrolling="no"
        title={title}
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
