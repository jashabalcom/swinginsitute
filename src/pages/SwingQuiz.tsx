import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, Users, Award, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useQuiz } from '@/hooks/useQuiz';
import { QUIZ_QUESTIONS, QuizAnswers } from '@/types/quiz';
import { QuizOptInForm } from '@/components/quiz/QuizOptInForm';

export default function SwingQuiz() {
  const {
    step,
    currentQuestion,
    answers,
    isSubmitting,
    progress,
    startQuiz,
    answerQuestion,
    goBack,
    submitOptIn,
  } = useQuiz();

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {step === 'landing' && (
          <QuizLanding key="landing" onStart={startQuiz} />
        )}
        
        {step === 'questions' && (
          <QuizQuestions
            key="questions"
            currentQuestion={currentQuestion}
            answers={answers}
            progress={progress}
            onAnswer={answerQuestion}
            onBack={goBack}
          />
        )}
        
        {step === 'optin' && (
          <QuizOptIn
            key="optin"
            onSubmit={submitOptIn}
            isSubmitting={isSubmitting}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function QuizLanding({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col"
    >
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-8"
          >
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">60-Second Assessment</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight"
          >
            Is Your Child's Swing Holding Them Back — Or Just{' '}
            <span className="text-primary">One Adjustment Away?</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto"
          >
            Take this 60-second quiz to find out what most parents miss — and what to focus on next.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={onStart}
              size="lg"
              className="btn-hero text-lg px-10 py-6 h-auto"
            >
              Start the Swing Quiz
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm">1,200+ Players Assessed</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-sm">MLB All-Star Coach</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="text-sm">Personalized Results</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 border-t border-border/50">
        <p className="text-center text-sm text-muted-foreground">
          The Swing Institute • Trusted by parents nationwide
        </p>
      </div>
    </motion.div>
  );
}

interface QuizQuestionsProps {
  currentQuestion: number;
  answers: QuizAnswers;
  progress: number;
  onAnswer: (questionId: keyof QuizAnswers, value: string) => void;
  onBack: () => void;
}

function QuizQuestions({
  currentQuestion,
  answers,
  progress,
  onAnswer,
  onBack,
}: QuizQuestionsProps) {
  const question = QUIZ_QUESTIONS[currentQuestion];
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onAnswer(question.id, value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col"
    >
      {/* Header with Progress */}
      <div className="p-4 md:p-6 border-b border-border/50">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of 7
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                {question.question}
              </h2>

              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full p-4 md:p-5 rounded-xl text-left transition-all border-2 ${
                      selectedValue === option.value
                        ? 'border-primary bg-primary/10 text-foreground'
                        : answers[question.id] === option.value
                        ? 'border-primary/50 bg-primary/5 text-foreground'
                        : 'border-border bg-card hover:border-primary/50 text-foreground'
                    }`}
                  >
                    <span className="text-base md:text-lg font-medium">
                      {option.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

interface QuizOptInProps {
  onSubmit: (data: { name: string; email: string; phone: string; playerName?: string }) => void;
  isSubmitting: boolean;
}

function QuizOptIn({ onSubmit, isSubmitting }: QuizOptInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center px-4 py-12"
    >
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Your Personalized Results Are Ready
          </h2>
          <p className="text-muted-foreground">
            Enter your info below to see your player's swing assessment and recommended next steps.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <QuizOptInForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </motion.div>
      </div>
    </motion.div>
  );
}
