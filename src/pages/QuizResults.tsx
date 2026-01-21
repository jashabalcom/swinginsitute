import { useLocation, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  ArrowRight, 
  Target, 
  Star,
  Award,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuizAnswers, ResultProfile, QUIZ_QUESTIONS } from '@/types/quiz';
import coachJashaImage from '@/assets/coach-jasha-seated.jpg';
import { ProTestimonialSection } from '@/components/home/ProTestimonialSection';

interface LocationState {
  answers: QuizAnswers;
  contact: { name: string; email: string; phone: string; playerName?: string };
  profile: ResultProfile;
}

export default function QuizResults() {
  const location = useLocation();
  const state = location.state as LocationState | null;

  // Redirect if no state (direct access)
  if (!state) {
    return <Navigate to="/swing-quiz" replace />;
  }

  const { answers, contact, profile } = state;
  const firstName = contact.name.split(' ')[0];
  const playerName = contact.playerName || 'your player';

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {firstName}, Here's What We Discovered
            </h1>
            <p className="text-lg text-muted-foreground">
              Based on your answers, {playerName} fits the{' '}
              <span className="text-primary font-semibold">{profile}</span> profile.
            </p>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-premium p-6 md:p-8 mb-8"
          >
            <ProfileContent profile={profile} answers={answers} playerName={playerName} />
          </motion.div>

          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-elevated p-6 md:p-8 mb-8"
          >
            <CTASection profile={profile} />
          </motion.div>

          {/* Coach Authority Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-premium p-6 md:p-8 mb-8"
          >
            <CoachSection />
          </motion.div>

          {/* Simplified Secondary Option - Less Prominent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <p className="text-sm text-muted-foreground">
              Not ready to book?{' '}
              <Link to="/masterclass" className="underline hover:text-foreground transition-colors">
                Watch our free masterclass first
              </Link>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pro Testimonial Section for Social Proof */}
      <ProTestimonialSection />
    </div>
  );
}

function ProfileContent({ 
  profile, 
  answers, 
  playerName 
}: { 
  profile: ResultProfile; 
  answers: QuizAnswers;
  playerName: string;
}) {
  const insights = getProfileInsights(profile, answers, playerName);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Target className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          {profile} Profile
        </h2>
      </div>

      <div className="space-y-4 mb-6">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground">{insight}</p>
          </div>
        ))}
      </div>

      <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
        <p className="text-foreground font-medium">
          {getReassurance(profile, playerName)}
        </p>
      </div>
    </div>
  );
}

function CTASection({ profile }: { profile: ResultProfile }) {
  const cta = getProfileCTA(profile);

  return (
    <div className="text-center">
      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
        {cta.headline}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
        {cta.description}
      </p>
      <Link to={cta.link}>
        <Button size="lg" className="btn-hero text-lg px-8 py-6 h-auto">
          {cta.buttonText}
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </Link>
      {cta.subtext && (
        <p className="text-sm text-muted-foreground mt-4">{cta.subtext}</p>
      )}
    </div>
  );
}

function CoachSection() {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-center">
      <img
        src={coachJashaImage}
        alt="Coach Jasha"
        className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
      />
      <div className="text-center md:text-left">
        <h3 className="text-xl font-bold text-foreground mb-2">
          Why Parents Trust Coach Jasha
        </h3>
        <p className="text-muted-foreground mb-4">
          With 15+ years of experience training players from youth baseball to the MLB, 
          Coach Jasha has helped over 1,200 players unlock their potential at the plate.
        </p>
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="w-4 h-4 text-primary" />
            <span>Trained MLB All-Star Cedric Mullins</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4 text-primary" />
            <span>1,200+ Players Coached</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Award className="w-4 h-4 text-primary" />
            <span>15+ Years Experience</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions for dynamic content
function getProfileInsights(profile: ResultProfile, answers: QuizAnswers, playerName: string): string[] {
  const levelLabel = QUIZ_QUESTIONS.find(q => q.id === 'level')?.options.find(o => o.value === answers.level)?.label || answers.level;
  const frustrationLabel = QUIZ_QUESTIONS.find(q => q.id === 'frustration')?.options.find(o => o.value === answers.frustration)?.label || answers.frustration;
  const goalLabel = QUIZ_QUESTIONS.find(q => q.id === 'parentGoal')?.options.find(o => o.value === answers.parentGoal)?.label || answers.parentGoal;

  switch (profile) {
    case 'Swing Foundation':
      return [
        `At ${answers.age} years old, ${playerName} is in the prime window for building swing fundamentals that will last a lifetime.`,
        `Your focus on "${frustrationLabel.toLowerCase()}" tells us exactly where to start.`,
        `Players at the ${levelLabel} level often see the biggest breakthroughs when they master the basics first.`,
        `Your goal to "${goalLabel.toLowerCase()}" is absolutely achievable with the right foundation in place.`,
      ];
    case 'Breakout Ready':
      return [
        `${playerName} is at a critical development stage where the right adjustments can lead to major breakthroughs.`,
        `The "${frustrationLabel.toLowerCase()}" you mentioned is common at this level — and very fixable.`,
        `Players at the ${levelLabel} level are often just one or two mechanical changes away from a breakthrough.`,
        `With your goal to "${goalLabel.toLowerCase()}", focused training now will pay dividends.`,
      ];
    case 'Next Level':
      return [
        `At ${answers.age}, ${playerName} is ready for advanced training that separates good players from great ones.`,
        `Addressing "${frustrationLabel.toLowerCase()}" at the ${levelLabel} level requires precision coaching.`,
        `Your goal of "${goalLabel.toLowerCase()}" demands a strategic approach to development.`,
        `The next 6-12 months are crucial for making an impression on scouts and coaches.`,
      ];
  }
}

function getReassurance(profile: ResultProfile, playerName: string): string {
  switch (profile) {
    case 'Swing Foundation':
      return `Good news: ${playerName} is exactly where many successful players started. With the right guidance now, you're setting them up for long-term success.`;
    case 'Breakout Ready':
      return `Great timing. ${playerName} has the experience base — now it's about refining the mechanics and building mental confidence to break through to the next level.`;
    case 'Next Level':
      return `${playerName} has put in the work. Now it's about precision training and strategic development to achieve your college baseball goals.`;
  }
}

function getProfileCTA(profile: ResultProfile): {
  headline: string;
  description: string;
  buttonText: string;
  link: string;
  subtext?: string;
} {
  switch (profile) {
    case 'Swing Foundation':
      return {
        headline: 'Your Recommended Next Step',
        description: 'Schedule a free Parent Game Plan Call to discuss the best path forward for your player.',
        buttonText: 'Book Your Free Call',
        link: '/book-call',
        subtext: 'No obligation. Just a conversation about your player.',
      };
    case 'Breakout Ready':
      return {
        headline: 'Ready to Break Through?',
        description: 'Book a Swing Assessment to identify the specific adjustments that will unlock your player\'s potential.',
        buttonText: 'Book Swing Assessment',
        link: '/book',
        subtext: 'In-person at our Atlanta facility or start with a Parent Call',
      };
    case 'Next Level':
      return {
        headline: 'Let\'s Map Out Your College Path',
        description: 'Schedule a strategy call to discuss advanced training, video analysis, and exposure opportunities.',
        buttonText: 'Schedule Strategy Call',
        link: '/book-call',
        subtext: 'For serious players targeting college baseball.',
      };
  }
}
