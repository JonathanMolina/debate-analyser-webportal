export type NewsletterContactType = 'email' | 'whatsapp' | 'both';

export interface ViewedDebateMetadata {
  id: string;
  title: string;
  viewedAt: string;
  url?: string;
}

export interface NewsletterSubscriptionMetadata {
  viewedDebates: ViewedDebateMetadata[];
  currentDebate?: {
    id: string;
    title: string;
  };
  sourcePage?: string;
  userAgent?: string;
  referrer?: string;
  subscribedAt: string;
}

export interface NewsletterSubscriptionInput {
  contactType: NewsletterContactType;
  email?: string;
  whatsapp?: string;
  name?: string;
  metadata?: NewsletterSubscriptionMetadata;
}

export interface NewsletterSubscriptionResult {
  success: boolean;
  error?: string;
}
