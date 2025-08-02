'use client';

import React, { useEffect, useState } from "react";

interface CountdownTimerProps {
    endTime: string;
    eday?: boolean;
  }
  
  const CountDownTimer: React.FC<CountdownTimerProps> = ({ endTime , eday }) => {
    const [daysLeft, setDaysLeft] = useState(0);
    const [hoursLeft, setHoursLeft] = useState("00");
    const [minutesLeft, setMinutesLeft] = useState("00");
    const [secondsLeft, setSecondsLeft] = useState("00");
    const [offerEnded, setOfferEnded] = useState(false);
  
    useEffect(() => {
      const countdown = () => {
        const endTimeInMs = new Date(endTime).getTime();
        const now = new Date().getTime();
        const distance = endTimeInMs - now;
  
        if (distance < 0) {
          setOfferEnded(true);
          return;
        }
  
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
        setDaysLeft(days);
        setHoursLeft(hours.toString().padStart(2, "0"));
        setMinutesLeft(minutes.toString().padStart(2, "0"));
        setSecondsLeft(seconds.toString().padStart(2, "0"));
      };
  
      const timer = setInterval(countdown, 1000);
      return () => clearInterval(timer);
    }, [endTime]);
  
    return (
      <div>
        {offerEnded ? (
          <p className="endOffer">Offer has ended</p>
        ) : (
          <ul className="pt_plus_countdown weekly">
            { daysLeft > 0 && eday && (
              <li className="count_1">
                <span className="days">{daysLeft}</span>
                <strong className="days_ref label-ref">Days</strong>
              </li>
            )}
            <li className="count_2">
              <span className="hours">{hoursLeft}</span>
              <strong className="hours_ref label-ref">Hours</strong>
            </li>
            <li className="count_3">
              <span className="minutes">{minutesLeft}</span>
              <strong className="minutes_ref label-ref">Minutes</strong>
            </li>
            <li className="count_4">
              <span className="seconds last">{secondsLeft}</span>
              <strong className="seconds_ref label-ref">Seconds</strong>
            </li>

            <li className="count_last">
                Left
            </li>
          </ul>
        )}
      </div>
    );
  };

  export default CountDownTimer;