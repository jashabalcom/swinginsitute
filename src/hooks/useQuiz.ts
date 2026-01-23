import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizAnswers, QuizContact, QuizStep, ResultProfile, calculateResultProfile } from '@/types/quiz';
import { useGHLSync } from '@/hooks/useGHLSync';
import { trackQuizStart, trackQuizStep, trackQuizComplete } from '@/lib/tracking';
import { ABVariant } from '@/hooks/useABTest';

const INITIAL_ANSWERS: QuizAnswers = {
  age: '',
  level: '',
  frustration: '',
  trainingFrequency: '',
  confidence: '',
  coachingHistory: '',
  parentGoal: '',
};

export function useQuiz(): {
  step: QuizStep;
  currentQuestion: number;
  answers: QuizAnswers;
  contact: QuizContact;
  isSubmitting: boolean;
  progress: number;
  startQuiz: (variant?: ABVariant) => void;
  answerQuestion: (questionId: keyof QuizAnswers, value: string) => void;
  goBack: () => void;
  submitOptIn: (contactData: QuizContact) => Promise<void>;
} {
  const navigate = useNavigate();
  const { syncQuiz } = useGHLSync();
  
  const [step, setStep] = useState<QuizStep>('landing');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(INITIAL_ANSWERS);
  const [contact, setContact] = useState<QuizContact>({ name: '', email: '', phone: '', smsConsent: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [abVariant, setAbVariant] = useState<ABVariant | null>(null);

  const startQuiz = useCallback((variant?: ABVariant) => {
    if (variant) {
      setAbVariant(variant);
    }
    trackQuizStart(variant);
    setStep('questions');
    setCurrentQuestion(0);
  }, []);

  const answerQuestion = useCallback((questionId: keyof QuizAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    // Auto-advance after small delay
    setTimeout(() => {
      if (currentQuestion < 6) {
        setCurrentQuestion(prev => prev + 1);
        trackQuizStep(currentQuestion + 2);
      } else {
        setStep('optin');
      }
    }, 400);
  }, [currentQuestion]);

  const goBack = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else {
      setStep('landing');
    }
  }, [currentQuestion]);

  const submitOptIn = useCallback(async (contactData: QuizContact) => {
    setContact(contactData);
    setIsSubmitting(true);

    try {
      const profile = calculateResultProfile(answers);
      
      // Sync to GHL
      await syncQuiz(
        contactData.email,
        contactData.name,
        contactData.phone,
        answers,
        profile,
        contactData.playerName
      );

      // Parse name into first/last for Enhanced Conversions
      const nameParts = contactData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Track quiz completion with Enhanced Conversions user data
      trackQuizComplete(profile, abVariant || undefined, {
        email: contactData.email,
        phone: contactData.phone,
        firstName,
        lastName,
      });

      // Navigate to results with state
      navigate('/quiz-results', {
        state: {
          answers,
          contact: contactData,
          profile,
        },
      });
    } catch (error) {
      console.error('[Quiz] Submit error:', error);
      // Still navigate on error - don't block user
      navigate('/quiz-results', {
        state: {
          answers,
          contact: contactData,
          profile: calculateResultProfile(answers),
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, navigate, syncQuiz, abVariant]);

  const progress = step === 'questions' ? ((currentQuestion + 1) / 7) * 100 : 0;

  return {
    step,
    currentQuestion,
    answers,
    contact,
    isSubmitting,
    progress,
    startQuiz,
    answerQuestion,
    goBack,
    submitOptIn,
  };
}
