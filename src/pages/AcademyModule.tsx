import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LessonCard } from "@/components/academy/LessonCard";
import { TierGate } from "@/components/academy/TierGate";
import { useCurriculum } from "@/hooks/useCurriculum";

export default function AcademyModule() {
  const { levelSlug, moduleSlug } = useParams<{ levelSlug: string; moduleSlug: string }>();
  const {
    levels,
    loading,
    getModuleProgress,
    isLessonCompleted,
    getLessonProgress,
    canAccessLevel,
  } = useCurriculum();

  const level = levels.find((l) => l.slug === levelSlug);
  const module = level?.modules?.find((m) => m.slug === moduleSlug);

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

  if (!level || !module) {
    return <Navigate to="/academy" replace />;
  }

  const progress = getModuleProgress(module);
  const hasAccess = canAccessLevel(level);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="py-4">
            <Link to={`/academy/level/${level.slug}`}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {level.title}
              </Button>
            </Link>
          </div>

          {/* Module Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-6 border-b border-border mb-8"
          >
            <div className="max-w-3xl">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Level {level.level_number} · {level.title}
              </span>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-1 mb-2">
                {module.title}
              </h1>
              {module.description && (
                <p className="text-muted-foreground">
                  {module.description}
                </p>
              )}

              {hasAccess && (
                <div className="flex items-center gap-4 mt-4">
                  <Progress value={progress} className="flex-1 max-w-xs h-2" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {progress}% complete
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Lessons - gated by tier */}
          <TierGate requiredTiers={level.required_tiers || []}>
            <div className="max-w-3xl">
              <h2 className="font-display text-lg font-bold text-foreground mb-4">
                Lessons ({module.lessons?.length || 0})
              </h2>
              <div className="space-y-2">
                {module.lessons?.map((lesson, index) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    isCompleted={isLessonCompleted(lesson.id)}
                    watchProgress={getLessonProgress(lesson.id)}
                    index={index}
                  />
                ))}
              </div>

              {(!module.lessons || module.lessons.length === 0) && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No lessons available yet. Check back soon!</p>
                </div>
              )}
            </div>
          </TierGate>
        </div>
      </main>
    </div>
  );
}
