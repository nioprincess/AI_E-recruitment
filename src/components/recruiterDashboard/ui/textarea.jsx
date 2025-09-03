import React from 'react';
import { cn } from '../lib/utils';

const Textarea = React.forwardRef(({ 
  className, 
  variant = "default", 
  rows = 4,
  disabled = false,
  resize = true,
  ...props 
}, ref) => {
  const variants = {
    default: "border-border focus:border-primary focus:ring-primary",
    error: "border-red-500 focus:border-red-500 focus:ring-red-500",
    success: "border-green-500 focus:border-green-500 focus:ring-green-500"
  };

  return (
    <textarea
      ref={ref}
      rows={rows}
      disabled={disabled}
      className={cn(
        "flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background",
        "placeholder:text-muted-foreground",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-colors duration-200",
        resize ? "resize" : "resize-none",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };