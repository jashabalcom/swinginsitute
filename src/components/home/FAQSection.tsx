import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "What age range is this program designed for?",
    answer: "The Swing Institute is designed for players ages 10-18. However, the mental training and fundamentals work for anyone serious about improving their game. I've worked with kids as young as 8 and college players who needed a mental edge."
  },
  {
    question: "How does the swing analysis work exactly?",
    answer: "You'll upload videos of your player's swings through the OnForm App (free download). I personally review each swing and provide detailed video feedback with specific drills and adjustments. Most parents say this is more valuable than in-person lessons because you can rewatch it anytime."
  },
  {
    question: "What if my child plays other positions besides hitting?",
    answer: "While hitting is our primary focus, champions are built through complete development. Our mental training, confidence building, and work ethic principles apply to every aspect of baseball. Plus, I often include fielding and base-running tips during our live sessions."
  },
  {
    question: "Do you work with travel ball players and high school varsity players?",
    answer: "Absolutely. I currently work with players at every level—from Little League to MLB. Many of our members are on travel teams, high school varsity, and some are already committed to college programs. The principles of elite hitting don't change based on your current level."
  },
  {
    question: "What if we can't attend the live coaching sessions?",
    answer: "All live sessions are recorded and available in your member portal. You'll never miss the content. Plus, you can submit questions ahead of time, and I'll make sure to address them during the session."
  },
  {
    question: "How is this different from YouTube videos or other online hitting content?",
    answer: "Three major differences: 1) This is personalized coaching, not generic content. 2) You get direct access to me—someone who's actually played professionally and coached All-Stars. 3) We focus heavily on the mental game and confidence, which most free content completely ignores."
  },
  {
    question: "What if my player loses interest or motivation?",
    answer: "That's exactly why we focus so heavily on mindset and mental training. Most players lose motivation because they don't see progress or don't understand their \"why.\" Our Inner Diamond program helps players develop intrinsic motivation that doesn't depend on external results."
  },
  {
    question: "Can parents be involved in the training?",
    answer: "Yes! I encourage parent involvement. You'll have access to everything your player does, plus our private parent community where you can connect with other baseball families. Many parents tell me they learn as much as their kids do."
  },
  {
    question: "What equipment do we need?",
    answer: "Just a phone or tablet to record swings and access the training. You don't need expensive equipment, cages, or facilities. Some of my best students practice in their backyard with a tee and a net. It's about quality reps, not expensive setups."
  },
  {
    question: "How quickly will we see results?",
    answer: "Most players see confidence improvements within 2-3 weeks. Mechanical changes typically show up in 30-60 days with consistent practice. But here's the key: we're building long-term development, not quick fixes that fall apart under pressure."
  },
  {
    question: "What if we're not satisfied?",
    answer: "You get a 30-day money-back guarantee. If you're not completely satisfied with the coaching, community, and content, just email me and I'll refund your membership—no questions asked."
  },
  {
    question: "Do you help with recruiting and college baseball?",
    answer: "Yes, especially in the Pro Plan. I help families navigate the recruiting process, create highlight videos, and understand what college coaches are really looking for. I've helped dozens of players earn college scholarships."
  },
  {
    question: "What makes you qualified to teach hitting?",
    answer: "I was drafted by the Chicago Cubs, played professionally, and have 20+ years of coaching experience. More importantly, I've developed MLB All-Stars like Cedric Mullins and helped hundreds of players reach their next level. But my biggest qualification? I've walked the exact path your son is trying to walk."
  },
  {
    question: "Is there a contract or can we cancel anytime?",
    answer: "No contracts. You can cancel anytime. The only commitment is to yourself and your player's development. However, our Founding Member pricing is locked in for life as long as you remain active."
  },
  {
    question: "What if we live outside the United States?",
    answer: "No problem! This is a completely remote program. I currently work with players in Canada, Australia, and several other countries. As long as you have internet access, you can participate fully."
  },
  {
    question: "How much time does this require each week?",
    answer: "The beauty of this program is it fits into your schedule. Plan for 2-3 hours per week including practice time, watching training videos, and participating in live calls. Quality over quantity—we're building efficient, focused training habits."
  }
];

export const FAQSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-header mb-4">
            FREQUENTLY ASKED <span className="text-primary">QUESTIONS</span>
          </h2>
          <p className="section-subheader mx-auto">
            Everything you need to know about The Swing Institute
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqData.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6 data-[state=open]:border-primary/50 transition-colors"
              >
                <AccordionTrigger className="text-left text-foreground hover:no-underline hover:text-primary py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-card border border-border rounded-xl p-8 max-w-xl mx-auto">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-4">
              Our team will respond to every message because we want to make sure this program is the right fit for your family.
            </p>
            <a
              href="mailto:support@swinginstitutebaseball.com"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              <Mail className="h-5 w-5" />
              support@swinginstitutebaseball.com
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
