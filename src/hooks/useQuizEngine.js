import { useState, useEffect, useRef, useMemo } from 'react';
import { useSettings } from '../context/SettingsContext';

// Helper function to shuffle an array (Fisher-Yates algorithm)
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export const useQuizEngine = (initialQuestions, timerDuration = 30) => {
    const { soundEnabled, hapticsEnabled } = useSettings();
    
    // Shuffle questions and their answers only once when the quiz starts
    const questions = useMemo(() => {
        const shuffledQs = shuffleArray(initialQuestions);
        return shuffledQs.map(q => ({
            ...q,
            answers: shuffleArray(q.answers)
        }));
    }, [initialQuestions]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [wrongQuestionsList, setWrongQuestionsList] = useState([]); // Track failed questions
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
        console.log(`[Haptics Triggered]: ${type}`);
    };

    const playFeedbackSound = (isCorrect) => {
        if (!soundEnabled) return;
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
            // Add the current question to the mistakes list
            setWrongQuestionsList(prev => [...prev, questions[currentIndex]]);
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
            wrongAnswers,
            wrongQuestions: wrongQuestionsList // Export mistakes
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
