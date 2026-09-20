import { FC } from 'react';
import { Mail } from 'lucide-react';
import { Button, ButtonProps } from '@/components/Button/Button';

export interface NewsletterButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClick: () => void;
}

export const NewsletterButton: FC<NewsletterButtonProps> = ({
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
      icon={<Mail size={14} className="text-primary" />}
      onClick={onClick}
      className={className}
      title="Receba alertas e análises no seu WhatsApp ou E-mail"
      aria-label="Abrir inscrição na newsletter"
      {...props}
    >
      <span>Newsletter</span>
    </Button>
  );
};
