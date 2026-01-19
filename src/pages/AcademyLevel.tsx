import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Diamond, Target, Dumbbell, Brain } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ModuleCard } from "@/components/academy/ModuleCard";
import { TierGate } from "@/components/academy/TierGate";
import { useCurriculum } from "@/hooks/useCurriculum";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  diamond: Diamond,
  target: Target,
  dumbbell: Dumbbell,
  brain: Brain,
};

export default function AcademyLevel() {
  const { levelSlug } = useParams<{ levelSlug: string }>();
  const { levels, loading, getLevelProgress, getModuleProgress, canAccessLevel, isLessonCompleted } =
    useCurriculum();

  const level = levels.find((l) => l.slug === levelSlug);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 flex items-center justify-center min-h-[60vh]">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  if (!level) {
    return <Navigate to="/academy" replace />;
  }

  const Icon = iconMap[level.icon || "book"] || Diamond;
  const progress = getLevelProgress(level);
  const hasAccess = canAccessLevel(level);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="py-4">
            <Link to="/academy">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Academy
              </Button>
            </Link>
          </div>

          {/* Level Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-6 border-b border-border mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Level {level.level_number}
                  </span>
                  {level.is_locked && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-medium">
                      PRO TRACK
                    </span>
                  )}
                </div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {level.title}
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                  {level.description}
                </p>

                {hasAccess && (
                  <div className="flex items-center gap-4 mt-4">
                    <Progress value={progress} className="flex-1 max-w-xs h-2" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {progress}% complete
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Content - gated by tier */}
          <TierGate requiredTiers={level.required_tiers || []}>
            <div className="max-w-3xl">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Modules
              </h2>
              <div className="space-y-3">
                {level.modules?.map((module, index) => {
                  const completedLessons = module.lessons?.filter((l) =>
                    isLessonCompleted(l.id)
                  ).length || 0;
                  const totalLessons = module.lessons?.length || 0;

                  return (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      levelSlug={level.slug}
                      progress={getModuleProgress(module)}
                      completedLessons={completedLessons}
                      totalLessons={totalLessons}
                      index={index}
                    />
                  );
                })}
              </div>

              {(!level.modules || level.modules.length === 0) && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No modules available yet. Check back soon!</p>
                </div>
              )}
            </div>
          </TierGate>
        </div>
      </main>
    </div>
  );
}
