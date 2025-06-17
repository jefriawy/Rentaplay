import { useEffect, useState, useMemo } from 'react';

const useCountdown = (targetDate) => {
  const countDownDate = useMemo(() => new Date(targetDate).getTime(), [targetDate]);

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const remainingTime = countDownDate - new Date().getTime();
      setCountDown(remainingTime);
    }, 1000);

    if (countDown <= 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [countDownDate, countDown]);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown) => {
  if (countDown <= 0) {
    return { minutes: 0, seconds: 0, isExpired: true };
  }
  
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return { minutes, seconds, isExpired: false };
};

export { useCountdown };