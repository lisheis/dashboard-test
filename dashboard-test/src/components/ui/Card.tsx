import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, interactive = false, ...props }) => {
  return (
    <div 
      className={cn(
        "glass-card p-6", 
        interactive && "glass-card-hover",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
