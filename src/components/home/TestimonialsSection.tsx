import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Coach Jasha completely transformed my son's swing. He went from struggling in travel ball to starting varsity as a freshman.",
    author: "Parent of High School Player",
    role: "Atlanta, GA",
  },
  {
    quote: "The phase-based system is what sets this apart. You're not just doing random drills — every single rep has a purpose.",
    author: "College Commit",
    role: "D1 Signee",
  },
  {
    quote: "I've worked with a lot of hitting coaches. Nobody breaks down the swing and builds confidence like Coach Jasha.",
    author: "Travel Ball Parent",
    role: "10U Player",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            WHAT PARENTS AND PLAYERS{" "}
            <span className="gradient-text-blue">ARE SAYING</span>
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-premium p-6 lg:p-8 relative"
            >
              <Quote className="w-10 h-10 text-primary/20 mb-4" />
              <blockquote className="text-foreground/90 leading-relaxed mb-6">
                "{testimonial.quote}"
              </blockquote>
              <div className="mt-auto">
                <p className="font-semibold text-foreground">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* MLB Credibility */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-block card-accent-red p-6 md:p-8">
            <p className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              MLB ALL-STAR <span className="text-primary">CEDRIC MULLINS</span>
            </p>
            <p className="text-muted-foreground">
              Publicly credited Coach Jasha Balcom with teaching him how to hit at the pro level.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
