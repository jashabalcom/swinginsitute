export interface QuizAnswers {
  age: string;
  level: string;
  frustration: string;
  trainingFrequency: string;
  confidence: string;
  coachingHistory: string;
  parentGoal: string;
}

export interface QuizContact {
  name: string;
  email: string;
  phone: string;
  playerName?: string;
}

export type QuizStep = 'landing' | 'questions' | 'optin' | 'results';

export type ResultProfile = 'Swing Foundation' | 'Breakout Ready' | 'Next Level';

export interface QuizQuestion {
  id: keyof QuizAnswers;
  question: string;
  options: { value: string; label: string }[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'age',
    question: "What is your player's age?",
    options: [
      { value: '8-10', label: '8-10 years old' },
      { value: '11-13', label: '11-13 years old' },
      { value: '14-16', label: '14-16 years old' },
      { value: '17-18+', label: '17-18+ years old' },
    ],
  },
  {
    id: 'level',
    question: 'What level are they currently playing at?',
    options: [
      { value: 'rec-league', label: 'Rec League' },
      { value: 'travel-ball', label: 'Travel Ball' },
      { value: 'high-school', label: 'High School' },
      { value: 'college-prep', label: 'College Prep' },
    ],
  },
  {
    id: 'frustration',
    question: "What's your biggest frustration with their development?",
    options: [
      { value: 'inconsistent-contact', label: 'Inconsistent contact' },
      { value: 'lack-of-power', label: 'Lack of power' },
      { value: 'low-confidence', label: 'Low confidence at the plate' },
      { value: 'not-getting-noticed', label: 'Not getting noticed by scouts/coaches' },
    ],
  },
  {
    id: 'trainingFrequency',
    question: 'How often is your player getting quality coaching?',
    options: [
      { value: 'weekly', label: 'Weekly lessons' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'rarely', label: 'Rarely or never' },
      { value: 'season-only', label: 'Only during season' },
    ],
  },
  {
    id: 'confidence',
    question: 'How confident is your player at the plate?',
    options: [
      { value: 'very-confident', label: 'Very confident' },
      { value: 'somewhat-confident', label: 'Somewhat confident' },
      { value: 'struggling', label: 'Struggling with confidence' },
      { value: 'inconsistent', label: 'Depends on the day' },
    ],
  },
  {
    id: 'coachingHistory',
    question: "What best describes your player's coaching history?",
    options: [
      { value: 'private-regular', label: 'Private lessons regularly' },
      { value: 'team-only', label: 'Team coaching only' },
      { value: 'mix', label: 'Mix of both' },
      { value: 'searching', label: 'Looking for the right coach' },
    ],
  },
  {
    id: 'parentGoal',
    question: "What's YOUR main goal as a parent?",
    options: [
      { value: 'college-scholarship', label: 'College scholarship' },
      { value: 'make-team', label: 'Make varsity or travel team' },
      { value: 'build-confidence', label: 'Build confidence and love for the game' },
      { value: 'clear-path', label: 'Find a clear path forward' },
    ],
  },
];

export function calculateResultProfile(answers: QuizAnswers): ResultProfile {
  const age = answers.age;
  const level = answers.level;
  const confidence = answers.confidence;

  // Swing Foundation: Younger players building fundamentals
  if (
    (age === '8-10' || age === '11-13') &&
    (level === 'rec-league' || level === 'travel-ball')
  ) {
    return 'Swing Foundation';
  }

  // Next Level: Older players with college goals
  if (
    (age === '17-18+' || age === '14-16') &&
    level === 'college-prep'
  ) {
    return 'Next Level';
  }

  // Breakout Ready: Mid-range players ready to level up
  return 'Breakout Ready';
}
