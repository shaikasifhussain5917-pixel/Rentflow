import { useState, useEffect } from "react";

export function useLocalTime() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // Update every minute to keep date/greeting strictly local and fresh
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const hour = now.getHours();
  
  let greeting = "Good evening";
  if (hour >= 5 && hour < 12) {
    greeting = "Good morning";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good afternoon";
  }

  const formattedDate = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const monthYear = now.toLocaleDateString("en-GB", {
    month: "long", 
    year: "numeric"
  });

  return { greeting, formattedDate, monthYear };
}
