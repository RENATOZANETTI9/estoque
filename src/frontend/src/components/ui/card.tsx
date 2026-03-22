import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className = '', children, ...props }: CardProps) {
  var base = 'rounded-xl border border-white/10 bg-gray-800/50 shadow-sm';
  var classes = base + (className ? ' ' + className : '');
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }: CardProps) {
  var base = 'flex flex-col space-y-1.5 p-6';
  var classes = base + (className ? ' ' + className : '');
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  var base = 'text-lg font-semibold leading-none tracking-tight';
  var classes = base + (className ? ' ' + className : '');
  return (
    <h3 className={classes} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className = '', children, ...props }: CardProps) {
  var base = 'p-6 pt-0';
  var classes = base + (className ? ' ' + className : '');
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}