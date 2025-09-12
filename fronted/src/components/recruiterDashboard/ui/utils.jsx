// src/components/ui/utils.js

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind classes with conditionals and removes duplicates.
 * Example:
 * cn("p-4", isActive && "bg-blue-500", "text-white")
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


