import { motion } from "framer-motion";
import { Video, ExternalLink, Smartphone, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OnFormCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="card-premium p-6 border-2 border-secondary/30"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-secondary/20 rounded-xl">
          <Video className="w-6 h-6 text-secondary" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Submit Swings with OnForm
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Our recommended tool for swing video analysis
          </p>
        </div>
      </div>

      <ul className="space-y-2 mb-5">
        {[
          "Frame-by-frame analysis tools",
          "Side-by-side swing comparison",
          "Direct coach feedback & annotations",
        ].map((benefit) => (
          <li key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
            {benefit}
          </li>
        ))}
      </ul>

      <div className="bg-muted/50 rounded-lg p-3 mb-5">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Invite Code Required:</span>{" "}
          Use your member invite code to connect your OnForm account to Swing Institute.
        </p>
      </div>

      <div className="space-y-3">
        <a
          href="https://onform.com/web-app-sign-in/"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            <Video className="w-4 h-4 mr-2" />
            Sign In to OnForm
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </a>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Smartphone className="w-4 h-4" />
          <span>Download the app:</span>
          <a
            href="https://apps.apple.com/app/onform-video-analysis/id1490334045"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary hover:underline"
          >
            iOS
          </a>
          <span>•</span>
          <a
            href="https://play.google.com/store/apps/details?id=com.onformapp.onform"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary hover:underline"
          >
            Android
          </a>
        </div>
      </div>
    </motion.section>
  );
}
