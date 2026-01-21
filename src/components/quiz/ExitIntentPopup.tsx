import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Mail, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Link } from 'react-router-dom';

const exitIntentSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type ExitIntentFormData = z.infer<typeof exitIntentSchema>;

interface ExitIntentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  currentQuestion: number;
  onSaveProgress: (email: string) => Promise<void>;
}

export function ExitIntentPopup({
  isOpen,
  onClose,
  currentQuestion,
  onSaveProgress,
}: ExitIntentPopupProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ExitIntentFormData>({
    resolver: zodResolver(exitIntentSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = async (data: ExitIntentFormData) => {
    setIsSubmitting(true);
    try {
      await onSaveProgress(data.email);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to save progress:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 px-4"
          >
            <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 md:p-8">
                {!isSuccess ? (
                  <>
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-primary/10 rounded-full">
                        <Clock className="w-8 h-8 text-primary" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center mb-6">
                      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                        Wait! Don't Lose Your Progress
                      </h3>
                      <p className="text-muted-foreground">
                        You're {currentQuestion + 1} of 7 questions in.
                        <br />
                        Enter your email and we'll save your spot.
                      </p>
                    </div>

                    {/* Form */}
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                  <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="h-12 pl-11 bg-background border-border"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          size="lg"
                          className="w-full btn-hero h-12"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            'Save My Progress'
                          )}
                        </Button>
                      </form>
                    </Form>

                    {/* Skip */}
                    <button
                      onClick={onClose}
                      className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      No thanks, I'll start over later
                    </button>

                    {/* Privacy Link */}
                    <p className="text-center text-xs text-muted-foreground mt-4">
                      We respect your privacy.{' '}
                      <Link to="/privacy" className="underline hover:text-foreground transition-colors">
                        Privacy Policy
                      </Link>
                    </p>
                  </>
                ) : (
                  /* Success State */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-green-500/10 rounded-full">
                        <Mail className="w-8 h-8 text-green-500" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Progress Saved!
                    </h3>
                    <p className="text-muted-foreground">
                      Check your email for a link to continue.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
