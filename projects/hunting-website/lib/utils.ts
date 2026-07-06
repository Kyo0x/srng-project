import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// classic cn utility - every project needs this
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
