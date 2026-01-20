import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function ProTestimonialSection() {
  const [isTestimonialPlaying, setIsTestimonialPlaying] = useState(false);
  const [isTestimonialMuted, setIsTestimonialMuted] = useState(false);
  const [isTrainingPlaying, setIsTrainingPlaying] = useState(false);
  const testimonialRef = useRef<HTMLVideoElement>(null);
  const trainingRef = useRef<HTMLVideoElement>(null);

  // Auto-play training video when in view (muted)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && trainingRef.current) {
            trainingRef.current.play();
            setIsTrainingPlaying(true);
          } else if (trainingRef.current) {
            trainingRef.current.pause();
            setIsTrainingPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (trainingRef.current) {
      observer.observe(trainingRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const toggleTestimonial = () => {
    if (testimonialRef.current) {
      if (isTestimonialPlaying) {
        testimonialRef.current.pause();
      } else {
        testimonialRef.current.play();
      }
      setIsTestimonialPlaying(!isTestimonialPlaying);
    }
  };

  const toggleTestimonialMute = () => {
    if (testimonialRef.current) {
      testimonialRef.current.muted = !isTestimonialMuted;
      setIsTestimonialMuted(!isTestimonialMuted);
    }
  };

  return (
    <section className="py-24 md:py-32 bg-card/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            WHAT THE <span className="gradient-text-red">PROS SAY</span>
          </h2>
          <p className="section-subheader">
            Hear directly from MLB All-Star Cedric Mullins about his development with Coach Jasha
          </p>
        </motion.div>

        {/* Videos Grid */}
        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto items-start">
          {/* Testimonial Video - Primary (3 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="card-accent-red p-1.5 rounded-xl">
              <div className="relative rounded-lg overflow-hidden bg-background">
                <video
                  ref={testimonialRef}
                  className="w-full aspect-video object-cover"
                  src="/videos/cedric-mullins-testimonial.mp4"
                  playsInline
                  onEnded={() => setIsTestimonialPlaying(false)}
                />
                
                {/* Play/Pause Overlay */}
                <div
                  onClick={toggleTestimonial}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                >
                  {!isTestimonialPlaying && (
                    <div className="bg-primary/90 rounded-full p-5 group-hover:scale-110 transition-transform shadow-2xl">
                      <Play className="w-10 h-10 text-primary-foreground fill-primary-foreground ml-1" />
                    </div>
                  )}
                </div>

                {/* Controls when playing */}
                {isTestimonialPlaying && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-4 flex items-center gap-4">
                    <button
                      onClick={toggleTestimonial}
                      className="p-2 rounded-full bg-card/80 hover:bg-card transition-colors"
                    >
                      <Pause className="w-5 h-5 text-foreground" />
                    </button>
                    <button
                      onClick={toggleTestimonialMute}
                      className="p-2 rounded-full bg-card/80 hover:bg-card transition-colors"
                    >
                      {isTestimonialMuted ? (
                        <VolumeX className="w-5 h-5 text-foreground" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-foreground" />
                      )}
                    </button>
                  </div>
                )}

                {/* Label when not playing */}
                {!isTestimonialPlaying && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent p-4">
                    <p className="text-sm text-muted-foreground">Click to play with sound</p>
                    <p className="text-foreground font-semibold">THE INTERVIEW</p>
                  </div>
                )}
              </div>
            </div>
            <p className="text-center text-muted-foreground mt-3 text-sm">
              Breaking It Down with Bordick — Cedric Mullins discusses his development
            </p>
          </motion.div>

          {/* Training Video - Secondary (2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="card-premium p-1.5 rounded-xl">
              <div className="relative rounded-lg overflow-hidden bg-background">
                <video
                  ref={trainingRef}
                  className="w-full aspect-video object-cover"
                  src="/videos/cedric-mullins-training.mp4"
                  muted
                  loop
                  playsInline
                />
                
                {/* Label overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {isTrainingPlaying ? "Now Playing" : "Auto-plays when visible"}
                  </p>
                  <p className="text-foreground font-semibold text-sm">THE PROOF</p>
                </div>
              </div>
            </div>
            <p className="text-center text-muted-foreground mt-3 text-sm">
              MLB Spring Training Prep Session
            </p>
          </motion.div>
        </div>

        {/* Quote & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <blockquote className="text-xl md:text-2xl text-foreground/90 italic max-w-3xl mx-auto mb-8">
            "Cedric Mullins publicly credited Coach Jasha with teaching him how to hit at the pro level."
          </blockquote>
          <Link to="/masterclass">
            <Button className="btn-hero">Watch Free Masterclass</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
