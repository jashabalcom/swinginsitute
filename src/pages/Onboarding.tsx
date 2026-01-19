import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ArrowLeft,
  Target,
  User,
  Trophy,
  Calendar,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const playerLevels = [
  { value: "beginner", label: "Beginner", description: "Just starting out, learning the basics" },
  { value: "recreational", label: "Recreational", description: "Playing for fun, some experience" },
  { value: "travel", label: "Travel Ball", description: "Competitive youth league" },
  { value: "high-school", label: "High School", description: "Varsity or JV level" },
  { value: "college", label: "College", description: "D1, D2, D3, NAIA, or JUCO" },
  { value: "pro", label: "Pro/Semi-Pro", description: "Minor leagues or independent ball" },
];

const struggles = [
  { value: "bat-speed", label: "Bat Speed", description: "Need more power and velocity" },
  { value: "contact", label: "Making Contact", description: "Struggling to barrel the ball" },
  { value: "timing", label: "Timing", description: "Always early or late on pitches" },
  { value: "mechanics", label: "Swing Mechanics", description: "Something feels off in my swing" },
  { value: "confidence", label: "Confidence", description: "Mental game needs work" },
  { value: "consistency", label: "Consistency", description: "Good days and bad days" },
];

const seasonStatuses = [
  { value: "off-season", label: "Off-Season", description: "No games, full development mode" },
  { value: "pre-season", label: "Pre-Season", description: "Getting ready for upcoming season" },
  { value: "in-season", label: "In-Season", description: "Currently playing games" },
  { value: "year-round", label: "Year-Round", description: "Always training and competing" },
];

const firstWeekTasks = [
  { day: 1, title: "Watch: Welcome to The Swing Institute", description: "Understanding the system and your path forward", duration: "15 min" },
  { day: 1, title: "Submit: Baseline Swing Video", description: "Record your current swing from behind and the side", duration: "20 min" },
  { day: 2, title: "Watch: The Foundation of Elite Swings", description: "The physics and biomechanics that matter", duration: "25 min" },
  { day: 3, title: "Drill: The Load Position", description: "Master the starting point of power", duration: "15 min" },
  { day: 4, title: "Drill: Hip Rotation Basics", description: "Learn to generate power from the ground up", duration: "20 min" },
  { day: 5, title: "Review: Coach Feedback on Baseline", description: "Personalized analysis of your starting point", duration: "10 min" },
  { day: 6, title: "Drill: Putting It Together", description: "Combine load and rotation in dry swings", duration: "25 min" },
  { day: 7, title: "Submit: Week 1 Progress Video", description: "Show your improvement and get next steps", duration: "15 min" },
];

type Step = "welcome" | "player-info" | "level" | "struggle" | "season" | "first-week" | "complete";

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState<Step>("welcome");
  const [saving, setSaving] = useState(false);
  
  // Form data
  const [playerName, setPlayerName] = useState("");
  const [playerAge, setPlayerAge] = useState("");
  const [playerLevel, setPlayerLevel] = useState("");
  const [struggle, setStruggle] = useState("");
  const [seasonStatus, setSeasonStatus] = useState("");

  const steps: Step[] = ["welcome", "player-info", "level", "struggle", "season", "first-week", "complete"];
  const currentStepIndex = steps.indexOf(step);
  const progressPercent = (currentStepIndex / (steps.length - 1)) * 100;

  const canProceed = () => {
    switch (step) {
      case "welcome": return true;
      case "player-info": return playerName.trim().length > 0 && playerAge.trim().length > 0;
      case "level": return playerLevel.length > 0;
      case "struggle": return struggle.length > 0;
      case "season": return seasonStatus.length > 0;
      case "first-week": return true;
      default: return true;
    }
  };

  const handleNext = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          player_name: playerName,
          player_age: parseInt(playerAge),
          player_level: playerLevel,
          onboarding_completed: true,
          current_phase: "Phase 1: Foundation",
          current_week: 1,
        })
        .eq("user_id", user.id);

      if (error) throw error;
      
      await refreshProfile();
      toast.success("Welcome to The Swing Institute!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to save profile. Please try again.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const slideVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      {step !== "welcome" && step !== "complete" && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <Progress value={progressPercent} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Step {currentStepIndex} of {steps.length - 2}
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {/* Welcome Step */}
            {step === "welcome" && (
              <motion.div
                key="welcome"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="text-center space-y-8"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                
                <div>
                  <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                    Welcome to <span className="text-primary">The Swing Institute</span>
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                    Let's set up your personalized training path. This will only take a few minutes, 
                    and it helps us create the perfect program for your development.
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 text-center py-6">
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">Personalized Focus</p>
                    <p className="text-xs text-muted-foreground">Based on your needs</p>
                  </div>
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <Calendar className="w-8 h-8 text-secondary mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">14-Day Kickstart</p>
                    <p className="text-xs text-muted-foreground">Guided introduction</p>
                  </div>
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">Clear Progress</p>
                    <p className="text-xs text-muted-foreground">Track your wins</p>
                  </div>
                </div>

                <Button onClick={handleNext} className="btn-hero">
                  Let's Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* Player Info Step */}
            {step === "player-info" && (
              <motion.div
                key="player-info"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
                    <User className="w-8 h-8 text-secondary" />
                  </div>
                  <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                    Tell us about the player
                  </h2>
                  <p className="text-muted-foreground">
                    Who are we building this program for?
                  </p>
                </div>

                <div className="space-y-6 max-w-md mx-auto">
                  <div className="space-y-2">
                    <Label htmlFor="playerName" className="text-foreground">Player's First Name</Label>
                    <Input
                      id="playerName"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="e.g., Jake"
                      className="bg-card border-border text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="playerAge" className="text-foreground">Player's Age</Label>
                    <Input
                      id="playerAge"
                      type="number"
                      value={playerAge}
                      onChange={(e) => setPlayerAge(e.target.value)}
                      placeholder="e.g., 14"
                      min="5"
                      max="50"
                      className="bg-card border-border text-foreground"
                    />
                  </div>
                </div>

                <div className="flex justify-center gap-4 pt-4">
                  <Button variant="outline" onClick={handleBack} className="border-border">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleNext} disabled={!canProceed()} className="bg-primary hover:bg-primary/90">
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Level Step */}
            {step === "level" && (
              <motion.div
                key="level"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                    <Trophy className="w-8 h-8 text-accent" />
                  </div>
                  <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                    What level is {playerName || "the player"}?
                  </h2>
                  <p className="text-muted-foreground">
                    This helps us calibrate the right intensity and drills
                  </p>
                </div>

                <RadioGroup value={playerLevel} onValueChange={setPlayerLevel} className="space-y-3">
                  {playerLevels.map((level) => (
                    <label
                      key={level.value}
                      className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                        playerLevel === level.value
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-muted-foreground"
                      }`}
                    >
                      <RadioGroupItem value={level.value} className="sr-only" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{level.label}</p>
                        <p className="text-sm text-muted-foreground">{level.description}</p>
                      </div>
                      {playerLevel === level.value && (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      )}
                    </label>
                  ))}
                </RadioGroup>

                <div className="flex justify-center gap-4 pt-4">
                  <Button variant="outline" onClick={handleBack} className="border-border">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleNext} disabled={!canProceed()} className="bg-primary hover:bg-primary/90">
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Struggle Step */}
            {step === "struggle" && (
              <motion.div
                key="struggle"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                    What's the biggest struggle right now?
                  </h2>
                  <p className="text-muted-foreground">
                    We'll prioritize this in your initial training
                  </p>
                </div>

                <RadioGroup value={struggle} onValueChange={setStruggle} className="grid sm:grid-cols-2 gap-3">
                  {struggles.map((s) => (
                    <label
                      key={s.value}
                      className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                        struggle === s.value
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-muted-foreground"
                      }`}
                    >
                      <RadioGroupItem value={s.value} className="sr-only" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{s.label}</p>
                        <p className="text-xs text-muted-foreground">{s.description}</p>
                      </div>
                      {struggle === s.value && (
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      )}
                    </label>
                  ))}
                </RadioGroup>

                <div className="flex justify-center gap-4 pt-4">
                  <Button variant="outline" onClick={handleBack} className="border-border">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleNext} disabled={!canProceed()} className="bg-primary hover:bg-primary/90">
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Season Status Step */}
            {step === "season" && (
              <motion.div
                key="season"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
                    <Calendar className="w-8 h-8 text-secondary" />
                  </div>
                  <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                    Where are you in the season?
                  </h2>
                  <p className="text-muted-foreground">
                    We'll adjust the training intensity accordingly
                  </p>
                </div>

                <RadioGroup value={seasonStatus} onValueChange={setSeasonStatus} className="space-y-3 max-w-md mx-auto">
                  {seasonStatuses.map((status) => (
                    <label
                      key={status.value}
                      className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                        seasonStatus === status.value
                          ? "border-secondary bg-secondary/10"
                          : "border-border bg-card hover:border-muted-foreground"
                      }`}
                    >
                      <RadioGroupItem value={status.value} className="sr-only" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{status.label}</p>
                        <p className="text-sm text-muted-foreground">{status.description}</p>
                      </div>
                      {seasonStatus === status.value && (
                        <CheckCircle2 className="w-5 h-5 text-secondary" />
                      )}
                    </label>
                  ))}
                </RadioGroup>

                <div className="flex justify-center gap-4 pt-4">
                  <Button variant="outline" onClick={handleBack} className="border-border">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleNext} disabled={!canProceed()} className="bg-primary hover:bg-primary/90">
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* First Week Overview Step */}
            {step === "first-week" && (
              <motion.div
                key="first-week"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                    <Sparkles className="w-8 h-8 text-accent" />
                  </div>
                  <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                    Your First Week Plan
                  </h2>
                  <p className="text-muted-foreground">
                    Here's what {playerName || "you"} will accomplish in the first 7 days
                  </p>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {firstWeekTasks.map((task, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">D{task.day}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{task.title}</p>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded flex-shrink-0">
                        {task.duration}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-4 pt-4">
                  <Button variant="outline" onClick={handleBack} className="border-border">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleNext} className="bg-accent hover:bg-accent/90">
                    I'm Ready!
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Complete Step */}
            {step === "complete" && (
              <motion.div
                key="complete"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="text-center space-y-8"
              >
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent/20 mb-4">
                  <CheckCircle2 className="w-12 h-12 text-accent" />
                </div>
                
                <div>
                  <h2 className="font-display text-4xl font-bold text-foreground mb-4">
                    You're All Set, {playerName || "Player"}!
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                    Your personalized 14-day kickstart is ready. The first week focuses on 
                    building your foundation. Let's make this the transformation you've been waiting for.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-card border border-border max-w-md mx-auto">
                  <h3 className="font-display text-xl font-bold text-foreground mb-4">Your Profile</h3>
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Player</span>
                      <span className="text-foreground font-medium">{playerName}, age {playerAge}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Level</span>
                      <span className="text-foreground font-medium capitalize">{playerLevel.replace("-", " ")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Focus Area</span>
                      <span className="text-foreground font-medium capitalize">{struggle.replace("-", " ")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Season</span>
                      <span className="text-foreground font-medium capitalize">{seasonStatus.replace("-", " ")}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleComplete} 
                  disabled={saving}
                  className="btn-hero"
                >
                  {saving ? "Saving..." : "Go to Dashboard"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
