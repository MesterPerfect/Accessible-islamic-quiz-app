// src/hooks/useQuizEngine.js
import { useState, useEffect, useRef } from 'react';

// Disable temporarily for debugging
// import * as Haptics from 'expo-haptics';
// import { Audio } from 'expo-av';

export const useQuizEngine = (questions, timerDuration = 30) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [timeLeft, setTimeLeft] = useState(timerDuration);
    const [isFinished, setIsFinished] = useState(false);
    
    const timerRef = useRef(null);

    useEffect(() => {
        if (timeLeft > 0 && !isFinished) {
            timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0 && !isFinished) {
            handleAnswer(false); 
        }
        return () => clearTimeout(timerRef.current);
    }, [timeLeft, isFinished]);

    const handleAnswer = async (isCorrect, settings) => {
        clearTimeout(timerRef.current);

        if (isCorrect) {
            setScore(prev => prev + 1);
            // if (settings.haptics) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            setWrongAnswers(prev => prev + 1);
            // if (settings.haptics) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }

        const nextIndex = currentIndex + 1;
        if (nextIndex < questions.length) {
            setCurrentIndex(nextIndex);
            setTimeLeft(timerDuration);
        } else {
            setIsFinished(true);
        }
    };

    const calculateResult = () => {
        const percentage = (score / questions.length) * 100;
        return {
            percentage,
            passed: percentage >= 80,
            score,
            wrongAnswers
        };
    };

    return {
        currentQuestion: questions[currentIndex],
        currentIndex,
        timeLeft,
        isFinished,
        handleAnswer,
        calculateResult
    };
};
