import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  default: 'bg-cyan-500/20 text-cyan-400',
  secondary: 'bg-gray-500/20 text-gray-300',
  destructive: 'bg-red-500/20 text-red-400',
  outline: 'border border-white/20 text-gray-300',
};

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  var base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors';
  var variantClass = variantStyles[variant] || variantStyles.default;
  var classes = base + ' ' + variantClass + (className ? ' ' + className : '');
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}