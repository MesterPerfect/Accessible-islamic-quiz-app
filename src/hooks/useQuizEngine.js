import { useState, useEffect, useRef, useMemo } from 'react';
import { useSettings } from '../context/SettingsContext';

const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export const useQuizEngine = (initialQuestions, timerDuration = 30) => {
    const { soundEnabled, hapticsEnabled, feedbackEnabled } = useSettings();
    
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
    const [wrongQuestionsList, setWrongQuestionsList] = useState([]);
    const [timeLeft, setTimeLeft] = useState(timerDuration);
    const [isFinished, setIsFinished] = useState(false);
    
    // New States for Gamification
    const [lives, setLives] = useState(3);
    const [hintUsed, setHintUsed] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);

    const timerRef = useRef(null);

    // Timer logic
    useEffect(() => {
        if (timeLeft > 0 && !isFinished && !showFeedback) {
            timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0 && !isFinished && !showFeedback) {
            handleAnswer(null); // Time out
        }
        return () => clearTimeout(timerRef.current);
    }, [timeLeft, isFinished, showFeedback]);

    const triggerHapticFeedback = (type) => {
        if (!hapticsEnabled) return;
        console.log(`[Haptics Triggered]: ${type}`);
    };

    const playFeedbackSound = (isCorrect) => {
        if (!soundEnabled) return;
        console.log(isCorrect ? "[Sound Playing]: Correct" : "[Sound Playing]: Wrong");
    };

    const handleAnswer = (answerObj) => {
        if (selectedAnswer !== null || isFinished) return;
        
        clearTimeout(timerRef.current);
        setSelectedAnswer(answerObj);

        const correct = answerObj && answerObj.t === 1;
        setIsAnswerCorrect(correct);

        if (correct) {
            setScore(prev => prev + 1);
            triggerHapticFeedback('success');
            playFeedbackSound(true);
        } else {
            setWrongAnswers(prev => prev + 1);
            setWrongQuestionsList(prev => [...prev, questions[currentIndex]]);
            setLives(prev => prev - 1);
            triggerHapticFeedback('error');
            playFeedbackSound(false);
        }

        if (feedbackEnabled) {
            setShowFeedback(true);
        } else {
            // Automatically proceed if feedback is disabled
            proceedToNextQuestion(!correct);
        }
    };

    const proceedToNextQuestion = (wasWrong = false) => {
        const currentLives = wasWrong ? lives - 1 : lives;
        
        if (currentLives <= 0) {
            setIsFinished(true); // Game Over
            return;
        }

        const nextIndex = currentIndex + 1;
        if (nextIndex < questions.length) {
            setCurrentIndex(nextIndex);
            setTimeLeft(timerDuration);
            setSelectedAnswer(null);
            setIsAnswerCorrect(null);
            setShowFeedback(false);
            setHintUsed(false); // Reset hint for the new question
        } else {
            setIsFinished(true);
        }
    };

    const nextQuestion = () => {
        proceedToNextQuestion(isAnswerCorrect === false);
    };

    const useHint = () => {
        if (hintUsed || showFeedback || isFinished) return;
        setHintUsed(true);
    };

    const calculateResult = () => {
        const percentage = (score / questions.length) * 100;
        return {
            percentage,
            passed: lives > 0 && percentage >= 80, // Must survive and get 80%
            score,
            wrongAnswers,
            wrongQuestions: wrongQuestionsList
        };
    };

    return {
        currentQuestion: questions[currentIndex],
        currentIndex,
        timeLeft,
        isFinished,
        handleAnswer,
        calculateResult,
        lives,
        hintUsed,
        useHint,
        showFeedback,
        selectedAnswer,
        isAnswerCorrect,
        nextQuestion
    };
};
