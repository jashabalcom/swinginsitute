import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-8">
            Terms & Conditions
          </h1>
          
          <div className="prose prose-invert max-w-none space-y-8">
            <p className="text-muted-foreground text-lg">
              Last updated: January 2026
            </p>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using the Swing Institute website and services, you agree to be 
                bound by these Terms and Conditions. If you do not agree to these terms, please 
                do not use our services.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                2. Services
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Swing Institute provides baseball training services including online memberships, 
                in-person coaching sessions, and hybrid training programs. All services are subject 
                to availability and scheduling.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                3. Membership and Payments
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Membership fees are billed monthly or as otherwise stated at the time of purchase. 
                All payments are non-refundable unless otherwise specified. You may cancel your 
                membership at any time, and cancellation will take effect at the end of the current 
                billing period.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                4. Session Booking and Cancellation
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                In-person sessions must be cancelled at least 24 hours in advance for a full refund 
                or credit. Sessions cancelled with less than 24 hours notice may be forfeited. 
                No-shows will result in session forfeiture.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                5. User Conduct
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to use our services responsibly and respectfully. Any abusive, harmful, 
                or inappropriate behavior may result in termination of your account without refund.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                6. Intellectual Property
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                All content, including training materials, videos, and curriculum, is the property 
                of Swing Institute and may not be reproduced, distributed, or shared without 
                express written permission.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                7. Limitation of Liability
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Swing Institute is not liable for any injuries that may occur during training. 
                Participants assume all risks associated with physical activity and baseball training.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                8. Contact
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms and Conditions, please contact us at 
                support@swinginstitute.com.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
