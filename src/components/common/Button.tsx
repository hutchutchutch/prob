import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm h-10 min-w-[100px]',
  md: 'px-6 py-3 text-base h-12 min-w-[120px]',
  lg: 'px-8 py-4 text-lg h-14 min-w-[140px]',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      loading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'btn',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          loading && 'cursor-wait',
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <span className="spinner mr-2" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {Icon && iconPosition === 'left' && (
              <Icon className="w-4 h-4 mr-2" />
            )}
            {children}
            {Icon && iconPosition === 'right' && (
              <Icon className="w-4 h-4 ml-2" />
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Icon Button Component
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'danger';
  loading?: boolean;
}

const iconButtonSizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const iconButtonVariants = {
  default: 'btn-icon',
  primary: 'bg-primary-600 text-white hover:bg-primary-700 border-primary-600',
  danger: 'bg-error-600 text-white hover:bg-error-700 border-error-600',
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      icon: Icon,
      size = 'md',
      variant = 'default',
      loading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'btn-icon',
          iconButtonSizes[size],
          iconButtonVariants[variant],
          loading && 'cursor-wait',
          className
        )}
        {...props}
      >
        {loading ? <span className="spinner" /> : <Icon className="w-4 h-4" />}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';