import { FC } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { Button, ButtonProps } from '@/components/Button/Button';

export interface FeedbackButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClick: () => void;
}

export const FeedbackButton: FC<FeedbackButtonProps> = ({
  onClick,
  variant = 'outline',
  size = 'sm',
  className,
  ...props
}) => {
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      icon={<MessageSquarePlus size={14} className="text-primary" />}
      onClick={onClick}
      className={className}
      {...props}
    >
      <span>Feedback</span>
    </Button>
  );
};
