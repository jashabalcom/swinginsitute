import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, ExternalLink, PlayCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useCurriculum, Lesson, CurriculumModule } from "@/hooks/useCurriculum";

export default function AcademyLesson() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const {
    levels,
    loading,
    isLessonCompleted,
    getLessonProgress,
    markLessonComplete,
    canAccessLevel,
  } = useCurriculum();

  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentModule, setCurrentModule] = useState<CurriculumModule | null>(null);
  const [levelSlug, setLevelSlug] = useState<string>("");
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const [prevLesson, setPrevLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (!loading && levels.length > 0 && lessonId) {
      // Find the lesson across all levels/modules
      for (const level of levels) {
        for (const module of level.modules || []) {
          const lessonIndex = module.lessons?.findIndex((l) => l.id === lessonId) ?? -1;
          if (lessonIndex !== -1 && module.lessons) {
            setCurrentLesson(module.lessons[lessonIndex]);
            setCurrentModule(module);
            setLevelSlug(level.slug);
            
            // Set prev/next lessons
            setPrevLesson(lessonIndex > 0 ? module.lessons[lessonIndex - 1] : null);
            setNextLesson(
              lessonIndex < module.lessons.length - 1 ? module.lessons[lessonIndex + 1] : null
            );
            return;
          }
        }
      }
    }
  }, [loading, levels, lessonId]);

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

  if (!currentLesson || !currentModule) {
    return <Navigate to="/academy" replace />;
  }

  const level = levels.find((l) => l.slug === levelSlug);
  if (level && !canAccessLevel(level)) {
    return <Navigate to="/academy" replace />;
  }

  const isCompleted = isLessonCompleted(currentLesson.id);
  const progress = getLessonProgress(currentLesson.id);

  const handleMarkComplete = async () => {
    await markLessonComplete(currentLesson.id, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="py-4">
            <Link to={`/academy/level/${levelSlug}/module/${currentModule.slug}`}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {currentModule.title}
              </Button>
            </Link>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Video Player */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              {currentLesson.video_url ? (
                <div className="aspect-video bg-black rounded-xl overflow-hidden">
                  <iframe
                    src={currentLesson.video_url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <PlayCircle className="w-16 h-16 text-muted-foreground mb-2 mx-auto" />
                    <p className="text-muted-foreground">Video coming soon</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Lesson Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-sm text-muted-foreground">
                    {currentModule.title}
                  </span>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-1">
                    {currentLesson.title}
                  </h1>
                </div>
                <Button
                  onClick={handleMarkComplete}
                  disabled={isCompleted}
                  className={isCompleted ? "bg-green-600" : ""}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {isCompleted ? "Completed" : "Mark Complete"}
                </Button>
              </div>

              {currentLesson.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {currentLesson.description}
                </p>
              )}

              {/* Worksheet */}
              {currentLesson.worksheet_url && (
                <a
                  href={currentLesson.worksheet_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="font-medium">Download Worksheet</span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
              )}
            </motion.div>

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between pt-6 border-t border-border"
            >
              {prevLesson ? (
                <Link to={`/academy/lesson/${prevLesson.id}`}>
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link to={`/academy/lesson/${nextLesson.id}`}>
                  <Button>
                    Next Lesson
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link to={`/academy/level/${levelSlug}/module/${currentModule.slug}`}>
                  <Button>
                    Back to Module
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
