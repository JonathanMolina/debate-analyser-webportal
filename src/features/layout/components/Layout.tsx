import { FC } from 'react';
import { Outlet } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { HoneypotField } from '@/features/security/components/HoneypotField';
import { HumanVerificationModal } from '@/features/security/components/HumanVerificationModal';
import { useSecurityShield } from '@/features/security/hooks/useSecurityShield';

export const Layout: FC = () => {
  const {
    isVerificationRequired,
    honeypotValue,
    setHoneypotValue,
    handlePassedVerification
  } = useSecurityShield();

  return (
    <div className="min-h-screen bg-canvas text-text-main flex flex-col selection:bg-primary/25 selection:text-primary">
      {/* Honeypot invisível para desarmar scrapers e bots desatentos */}
      <HoneypotField value={honeypotValue} onChange={setHoneypotValue} />

      {/* Modal de desafio humano caso requisições atípicas ocorram */}
      <HumanVerificationModal
        isOpen={isVerificationRequired}
        onVerify={handlePassedVerification}
      />

      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-12">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
