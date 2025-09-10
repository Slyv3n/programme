import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isHappyHour(): boolean {
  const HAPPY_HOUR_START = 11;
  const HAPPY_HOUR_END = 19;
  const HAPPY_HOUR_DAYS = [0, 1, 2, 3, 4, 5];

  const now = new Date();
  const currentHourDecimal = now.getHours() + now.getMinutes() / 60;
  const currentDay = now.getDay();

  const isHappyDay = HAPPY_HOUR_DAYS.includes(currentDay);

  const isHappyTime = currentHourDecimal >= HAPPY_HOUR_START && currentHourDecimal < HAPPY_HOUR_END;

  return isHappyDay && isHappyTime;
}
