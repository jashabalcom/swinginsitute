import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-invert max-w-none space-y-8">
            <p className="text-muted-foreground text-lg">
              Last updated: January 2026
            </p>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                1. Information We Collect
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                make a purchase, or contact us for support. This may include:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Name and email address</li>
                <li>Phone number</li>
                <li>Payment information (processed securely by Stripe)</li>
                <li>Player information (name, age, skill level)</li>
                <li>Video submissions for coaching feedback</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services, 
                process transactions, send you technical notices and support messages, and respond 
                to your comments and questions.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                3. Cookies and Tracking Technologies
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use cookies and similar tracking technologies to collect information about your 
                browsing activities. This helps us understand how you use our website and improve 
                your experience. For detailed information, please see our{" "}
                <Link to="/cookies" className="text-primary hover:underline">
                  Cookie Policy
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                4. Third-Party Analytics
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use Google Analytics to analyze website traffic and usage patterns. Google Analytics 
                collects information such as how often you visit our site, what pages you visit, and 
                what other sites you used prior to coming to our site.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Google's ability to use and share information collected by Google Analytics is restricted 
                by the{" "}
                <a 
                  href="https://policies.google.com/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google Privacy Policy
                </a>.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                5. Advertising and Remarketing
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use Facebook Pixel to measure and optimize our advertising campaigns. When you visit 
                our website, the Pixel collects information about your activity to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                <li>Measure the effectiveness of our Facebook advertisements</li>
                <li>Show you relevant ads on Facebook and Instagram</li>
                <li>Build custom audiences for advertising purposes</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                This information may be shared with Meta (Facebook) in accordance with their{" "}
                <a 
                  href="https://www.facebook.com/privacy/policy/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Data Policy
                </a>. You can opt out of interest-based ads from Facebook in your{" "}
                <a 
                  href="https://www.facebook.com/help/568137493302217" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Facebook Ad Settings
                </a>.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                6. Information Sharing
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell your personal information. We may share information with:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li><strong>Service Providers:</strong> Stripe (payments), GoHighLevel (scheduling), and video hosting services</li>
                <li><strong>Analytics Partners:</strong> Google Analytics and Facebook for website analytics and advertising</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                7. Data Security
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We take reasonable measures to help protect information about you from loss, theft, 
                misuse, unauthorized access, disclosure, alteration, and destruction. All payment 
                information is processed securely through Stripe and is never stored on our servers.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                8. Data Retention
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information for as long as your account is active or as needed 
                to provide you services. We will retain and use your information as necessary to comply 
                with our legal obligations, resolve disputes, and enforce our agreements.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                9. Your Rights
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Delete your data</li>
                <li>Object to processing of your data</li>
                <li>Opt out of marketing communications</li>
                <li>Opt out of the "sale" of personal information (California residents)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise these rights, please contact us at support@swinginstitute.com.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                10. California Privacy Rights (CCPA)
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                California residents have specific rights regarding their personal information. You have 
                the right to request disclosure of what personal information we collect, request deletion 
                of your data, and opt out of the "sale" of your personal information. We do not sell 
                personal information in the traditional sense, but sharing data with advertising partners 
                may be considered a "sale" under CCPA. To opt out, please contact us.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                11. Children's Privacy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are intended for parents/guardians of young athletes and adult users. We do 
                not knowingly collect personal information from children under 13 without parental consent. 
                If you believe we have collected information from a child under 13, please contact us 
                immediately.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                12. International Transfers
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Your information may be transferred to and processed in the United States and other 
                countries where our service providers operate. By using our services, you consent to 
                the transfer of your information to these countries.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                13. Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:support@swinginstitute.com" className="text-primary hover:underline">
                  support@swinginstitute.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
