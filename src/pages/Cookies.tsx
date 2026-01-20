import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";

export default function Cookies() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-8">
            Cookie Policy
          </h1>
          
          <div className="prose prose-invert max-w-none space-y-8">
            <p className="text-muted-foreground text-lg">
              Last updated: January 2026
            </p>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                1. What Are Cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files that are placed on your computer or mobile device when you visit 
                our website. They are widely used to make websites work more efficiently and provide information 
                to website owners.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                2. Types of Cookies We Use
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    Essential Cookies
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These cookies are necessary for the website to function properly. They enable core functionality 
                    such as security, authentication, and session management. You cannot opt out of these cookies.
                  </p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                    <li>Authentication cookies (keeping you logged in)</li>
                    <li>Security cookies (protecting against fraud)</li>
                    <li>Session cookies (remembering your preferences during a session)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    Analytics Cookies
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We use Google Analytics to understand how visitors interact with our website. This helps us 
                    improve our website and services. Google Analytics collects information about your use of our 
                    site, including your IP address, pages visited, and time spent on each page.
                  </p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                    <li>Google Analytics (_ga, _gid cookies)</li>
                    <li>Duration: Up to 2 years</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    Marketing Cookies
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We use Facebook Pixel to measure the effectiveness of our advertising and deliver relevant 
                    advertisements to you on Facebook and other platforms. These cookies track your activity 
                    across websites to build a profile of your interests.
                  </p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                    <li>Facebook Pixel (_fbp cookie)</li>
                    <li>Duration: Up to 90 days</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    Third-Party Service Cookies
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our website uses third-party services that may set their own cookies:
                  </p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                    <li><strong>Stripe:</strong> Payment processing and fraud prevention</li>
                    <li><strong>GoHighLevel:</strong> Booking and calendar functionality</li>
                    <li><strong>Vimeo/YouTube:</strong> Video content delivery</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                3. How We Use Cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies to:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                <li>Keep you signed in to your account</li>
                <li>Remember your preferences and settings</li>
                <li>Understand how you use our website</li>
                <li>Improve our website and services</li>
                <li>Measure the effectiveness of our marketing campaigns</li>
                <li>Show you relevant advertisements on other platforms</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                4. Your Cookie Choices
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You can control and manage cookies in several ways:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    Browser Settings
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Most browsers allow you to refuse or accept cookies, delete existing cookies, and set 
                    preferences for certain websites. Check your browser's help section for instructions.
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    Opt-Out Links
                  </h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>
                      <a 
                        href="https://tools.google.com/dlpage/gaoptout" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Google Analytics Opt-Out
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://www.facebook.com/help/568137493302217" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Facebook Ad Preferences
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://optout.aboutads.info/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Digital Advertising Alliance Opt-Out
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                5. Cookie Duration
              </h2>
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-foreground font-semibold">Cookie Type</th>
                      <th className="px-4 py-3 text-left text-foreground font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-t border-border">
                      <td className="px-4 py-3">Session Cookies</td>
                      <td className="px-4 py-3">Deleted when browser closes</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-3">Authentication Cookies</td>
                      <td className="px-4 py-3">30 days</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-3">Google Analytics</td>
                      <td className="px-4 py-3">Up to 2 years</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-3">Facebook Pixel</td>
                      <td className="px-4 py-3">Up to 90 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                6. Updates to This Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or 
                for other operational, legal, or regulatory reasons. We encourage you to review this policy 
                periodically.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                7. Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about our use of cookies, please contact us at{" "}
                <a href="mailto:support@swinginstitute.com" className="text-primary hover:underline">
                  support@swinginstitute.com
                </a>
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                For more information about how we handle your personal data, please see our{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
