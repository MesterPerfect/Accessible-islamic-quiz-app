import { useState, useEffect, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';

export const useQuizEngine = (questions, timerDuration = 30) => {
    const { soundEnabled, hapticsEnabled } = useSettings();
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

    const triggerHapticFeedback = (type) => {
        if (!hapticsEnabled) return;
        
        // Placeholder for future native implementation
        console.log(`[Haptics Triggered]: ${type}`);
    };

    const playFeedbackSound = (isCorrect) => {
        if (!soundEnabled) return;
        
        // Placeholder for future native implementation
        console.log(isCorrect ? "[Sound Playing]: Correct" : "[Sound Playing]: Wrong");
    };

    const handleAnswer = (isCorrect) => {
        clearTimeout(timerRef.current);

        if (isCorrect) {
            setScore(prev => prev + 1);
            triggerHapticFeedback('success');
            playFeedbackSound(true);
        } else {
            setWrongAnswers(prev => prev + 1);
            triggerHapticFeedback('error');
            playFeedbackSound(false);
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
