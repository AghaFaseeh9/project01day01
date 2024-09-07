"use client"; // Enables client-side rendering for this component
import { useState, useRef, useEffect, ChangeEvent } from "react"; // import react hooks and types
import { Input } from "@/components/ui/input"; // import custom component
import { Button } from "@/components/ui/button"; // import custom Buttom component
import { clearInterval } from "timers";
import { Currency } from "lucide-react";

export default function Countdown() {
  // State to manage the duration input
  const [duration, setDuration] = useState<number | string>("");
  // State to manage the countdown timer value
  const [timeLeft, setTimeLeft] = useState<number>(0);
  // state to track if the timer is active
  const [isActive, setIsActive] = useState<boolean>(false);
  // state to track if the timer is paused
  const [isPaused, setIsPaused] = useState<boolean>(false);
  // Reference to store the timer ID
  const timeRef = useRef<NodeJS.Timeout | null>(null);

  // function to handle setting the duration of the countdown
  const handleSetDuration = (): void => {
    if (typeof duration === "number" && duration > 0) {
      setTimeLeft(duration); // set the countdown timer
      setIsActive(false); // Reset active state
      setIsPaused(false); // Reset paused state
      //  clear any existing timer
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    }
  };

  // Function to start the countdown timer
  const handleStart = (): void => {
    if (timeLeft > 0) {
      setIsActive(true); // set the timer to active
      setIsPaused(false); // Unpause the timer if it was paused
    }
  };
  // Function to pause the countdown timer
  const handlePause = (): void => {
    if (isActive) {
      setIsPaused(true); // set the timer as inactive
      setIsActive(false); // set timer as inactive
      // clear any existing timer
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    }
  };

  // function to reset the countdown timer
  const handleReset = (): void => {
    setIsActive(false); // set the timer as inactive
    setIsPaused(false); // set the timer as not to paused
    setTimeLeft(typeof duration === "number" ? duration : 0); // reset the timer to original duration
    // clear any existing timer
    if (timeRef.current) {
      clearInterval(timeRef.current);
    }
  };
  // useEffect hook to manage the countdown interval
  useEffect(() => {
    // If the timer is active and not paused
    if (isActive && !isPaused) {
      // Set an interval to decrease the time left
      timeRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          // If time is up , clear the interval
          if (prevTime <= 1) {
            clearInterval(timeRef.current!);
            return 0;
          }
          // Decrease the time left by one second
          return prevTime - 1;
        });
      }, 1000); // Interval of 1 second
    }
    //   cleanup function to clear the interval
    return () => {
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    };
  }, [isActive, isPaused]); // dependencies is array to return the effect
  //  Function to format the time left into mm : ss format
  const formatTime = (time: number): string => {
    const min = Math.floor(time / 60); //calculate minutes
    const seconds = time % 60; // calculate second
    // Return the formatted string
    return `${String(min).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };
  // function to handle changes in the duration input field;
  const handleDurationChanges = (e: ChangeEvent<HTMLInputElement>): void => {
    setDuration(Number(e.target.value) || ""); // update the duration state
  };
  // JSX return statement rendering the countdown UI
  return (
    // Container div for centering the content
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      {/* timer box Container */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        {/* title of the countdown timer */}
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark::text-gray-200 text-center">
          Countdown Timer
        </h1>
        {/* Input and set button Container */}
        <div className="flex items-center mb-6">
          <input
            type="number"
            id="duration"
            placeholder="Enter duration in seconds"
            value={duration}
            onChange={handleDurationChanges}
            className="flex-1 mr-4 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
          <button
            onClick={handleSetDuration}
            className="text-gray-800 dark:text-gray-200"
          >
            set
          </button>
        </div>
        {/* display the formatted time left */}
        <div className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center">
          {/* formatTime(timeleft) */}
        </div>
        {/* Button to start ,pause,and reset the timer */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleStart}
            className="text-gray-800 dark:text-gray-200"
          >
            {isPaused ? "Resume" : "Start"}
          </button>
          <button
            onClick={handlePause}
            className="text-gray-800 dark:text-gray-200"
          >
            Pause
          </button>
          <button
            onClick={handleReset}
            className="text-gray-800 dark:text-gray-200"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
