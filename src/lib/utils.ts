import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BATCH_OPTIONS: BatchType[] = [
  'TYECO', 'TYCSO', 'TYMEO', 'TYEEO',
  'SYECO', 'SYCSO', 'SYMEO', 'SYEEO',
  'FYECO', 'FYCSO', 'FYMEO', 'FYEEO'
];