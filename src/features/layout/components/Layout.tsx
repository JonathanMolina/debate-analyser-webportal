import { FC, useState } from 'react';
import { Outlet, useOutletContext } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { HoneypotField } from '@/features/security/components/HoneypotField';
import { HumanVerificationModal } from '@/features/security/components/HumanVerificationModal';
import { useSecurityShield } from '@/features/security/hooks/useSecurityShield';
import { FeedbackModal } from '@/features/feedback/components/FeedbackModal';
import { NewsletterModal } from '@/features/newsletter/components/NewsletterModal';
import { SupportFloatingPanel } from '@/features/support/components/SupportFloatingPanel';
import { Analytics } from '@vercel/analytics/react';

export interface LayoutContextType {
  onOpenNewsletter: () => void;
  onOpenFeedback: () => void;
}

export const useLayoutContext = () => useOutletContext<LayoutContextType>();

export const Layout: FC = () => {
  const {
    isVerificationRequired,
    honeypotValue,
    setHoneypotValue,
    handlePassedVerification
  } = useSecurityShield();

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

  const contextValue: LayoutContextType = {
    onOpenNewsletter: () => setIsNewsletterOpen(true),
    onOpenFeedback: () => setIsFeedbackOpen(true)
  };

  return (
    <div className="min-h-screen bg-canvas text-text-main flex flex-col selection:bg-primary/25 selection:text-primary relative overflow-x-hidden">
      {/* Honeypot invisível para desarmar scrapers e bots desatentos */}
      <HoneypotField value={honeypotValue} onChange={setHoneypotValue} />

      {/* Modal de desafio humano caso requisições atípicas ocorram */}
      <HumanVerificationModal
        isOpen={isVerificationRequired}
        onVerify={handlePassedVerification}
      />

      {/* Modal de Feedback do usuário */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {/* Modal de Inscrição na Newsletter */}
      <NewsletterModal
        isOpen={isNewsletterOpen}
        onClose={() => setIsNewsletterOpen(false)}
      />

      <Header
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onOpenNewsletter={() => setIsNewsletterOpen(true)}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-12">
        <Outlet context={contextValue} />
      </main>

      <Footer
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onOpenNewsletter={() => setIsNewsletterOpen(true)}
      />

      {/* Painel Flutuante de Apoio Comunitário (Mercado Pago / Pix / Cartão) */}
      <SupportFloatingPanel />

      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
};
