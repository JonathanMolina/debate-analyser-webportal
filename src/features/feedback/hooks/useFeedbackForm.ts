import { useState } from 'react';
import { submitFeedback } from '../api/feedbackApi';
import type { FeedbackCategory } from '../types/feedback.types';

export const useFeedbackForm = (onSuccessCallback?: () => void) => {
  const [category, setCategory] = useState<FeedbackCategory>('suggestion');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMessage('Por favor, digite sua mensagem antes de enviar.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const result = await submitFeedback({
      category,
      message,
      name: name.trim() || undefined,
      email: email.trim() || undefined
    });

    setIsLoading(false);

    if (result.success) {
      setIsSuccess(true);
      setMessage('');
      setName('');
      setEmail('');
      if (onSuccessCallback) {
        setTimeout(() => {
          onSuccessCallback();
          setIsSuccess(false);
        }, 1800);
      }
    } else {
      setErrorMessage(result.error || 'Não foi possível enviar o feedback.');
    }
  };

  const resetForm = () => {
    setMessage('');
    setName('');
    setEmail('');
    setCategory('suggestion');
    setIsSuccess(false);
    setErrorMessage(null);
  };

  return {
    category,
    setCategory,
    message,
    setMessage,
    name,
    setName,
    email,
    setEmail,
    isLoading,
    isSuccess,
    errorMessage,
    handleSubmit,
    resetForm
  };
};
