import React from 'react';
import { cn } from '../lib/utils';

const Input = React.forwardRef(({ className, type = "text", variant = "default", ...props }, ref) => {
  const variants = {
    default: "border-border focus:border-primary focus:ring-primary",
    error: "border-red-500 focus:border-red-500 focus:ring-red-500",
    success: "border-green-500 focus:border-green-500 focus:ring-green-500"
  };

  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border  bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };