export type FeedbackCategory = 'suggestion' | 'praise' | 'bug' | 'other';

export interface FeedbackInput {
  name?: string;
  email?: string;
  category: FeedbackCategory;
  message: string;
}

export interface FeedbackRecord extends FeedbackInput {
  id: string;
  created_at: string;
}
