import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

export default function Timer({ expiracao }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  
  useEffect(() => {
    if (!expiracao) return;
    
    const [minutes, seconds] = expiracao.split(':').map(Number);
    let totalSeconds = minutes * 60 + seconds;

    const timer = setInterval(() => {
      if (totalSeconds <= 0) {
        setIsExpired(true);
        clearInterval(timer);
        return;
      }

      totalSeconds -= 1;
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      setTimeLeft(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [expiracao]);

  if (!expiracao) return null;

  return (
    <Badge 
      variant="outline" 
      className={`flex items-center gap-1 px-3 py-1 ${
        isExpired 
          ? 'bg-red-100 text-red-800 border-red-200' 
          : 'bg-blue-100 text-blue-800 border-blue-200'
      }`}
    >
      <Clock className="w-4 h-4" />
      {isExpired ? 'Expirado' : timeLeft || expiracao}
    </Badge>
  );
}