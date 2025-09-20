// hooks/useCountdown.ts
import { useState, useEffect } from 'react';

interface CountdownResult {
  timeLeft: string;
  isExpired: boolean;
  progress: number; // 0-100 percentage
}

export const useCountdown = (createdAt: string, durationHours: number = 3): CountdownResult => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(100);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const createdTime = new Date(createdAt).getTime();
      const expiryTime = createdTime + (durationHours * 60 * 60 * 1000); // 3 hours in milliseconds
      const now = new Date().getTime();
      const difference = expiryTime - now;

      if (difference <= 0) {
        setTimeLeft('Expired');
        setIsExpired(true);
        setProgress(0);
        return;
      }

      // Calculate remaining time
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Format time string
      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${seconds}s`);
      }

      // Calculate progress (100% at start, 0% at expiry)
      const totalDuration = durationHours * 60 * 60 * 1000;
      const elapsed = now - createdTime;
      const progressPercent = Math.max(0, Math.min(100, ((totalDuration - elapsed) / totalDuration) * 100));
      setProgress(progressPercent);
      
      setIsExpired(false);
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [createdAt, durationHours]);

  return { timeLeft, isExpired, progress };
};
