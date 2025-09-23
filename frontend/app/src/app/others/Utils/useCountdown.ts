import { useState, useEffect } from 'react';

interface CountdownResult {
  timeLeft: string;
  isExpired: boolean;
  progress: number; 
}

export const useCountdown = (createdAt: string, durationHours: number = 3): CountdownResult => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(100);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const createdTime = new Date(createdAt).getTime();
      const expiryTime = createdTime + (durationHours * 60 * 60 * 1000); 
      const now = new Date().getTime();
      const difference = expiryTime - now;

      if (difference <= 0) {
        setTimeLeft('Expired');
        setIsExpired(true);
        setProgress(0);
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${seconds}s`);
      }

      const totalDuration = durationHours * 60 * 60 * 1000;
      const elapsed = now - createdTime;
      const progressPercent = Math.max(0, Math.min(100, ((totalDuration - elapsed) / totalDuration) * 100));
      setProgress(progressPercent);
      
      setIsExpired(false);
    };

    calculateTimeLeft();

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [createdAt, durationHours]);

  return { timeLeft, isExpired, progress };
};
