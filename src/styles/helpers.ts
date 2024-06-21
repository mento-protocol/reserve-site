import { clsx, ClassArray, ClassDictionary } from "clsx";
import { twMerge } from "tailwind-merge";

type ClassValue =
  | string
  | number
  | bigint
  | boolean
  | ClassArray
  | ClassDictionary;

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
