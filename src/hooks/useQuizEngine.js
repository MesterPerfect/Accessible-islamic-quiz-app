import { useState, useEffect, useRef, useMemo } from 'react';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
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
    
    // States for Gamification
    const [lives, setLives] = useState(3);
    const [hintUsed, setHintUsed] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);

    const timerRef = useRef(null);
    const correctSoundRef = useRef(null);
    const wrongSoundRef = useRef(null);

    // Load sounds on mount and unload on unmount
    useEffect(() => {
        const loadAudioFiles = async () => {
            try {
                const { sound: correct } = await Audio.Sound.createAsync(
                    require('../../assets/sounds/correct.mp3')
                );
                const { sound: wrong } = await Audio.Sound.createAsync(
                    require('../../assets/sounds/wrong.mp3')
                );
                correctSoundRef.current = correct;
                wrongSoundRef.current = wrong;
            } catch (error) {
                // Audio files missing or failed to load, fail silently
            }
        };

        loadAudioFiles();

        return () => {
            if (correctSoundRef.current) correctSoundRef.current.unloadAsync();
            if (wrongSoundRef.current) wrongSoundRef.current.unloadAsync();
        };
    }, []);

    // Timer logic
    useEffect(() => {
        if (timeLeft > 0 && !isFinished && !showFeedback) {
            timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0 && !isFinished && !showFeedback) {
            handleAnswer(null); // Time out
        }
        return () => clearTimeout(timerRef.current);
    }, [timeLeft, isFinished, showFeedback]);

    const triggerHapticFeedback = async (type) => {
        if (!hapticsEnabled) return;
        try {
            if (type === 'success') {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } else {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
        } catch (error) {
            // Ignore if device does not support haptics
        }
    };

    const playFeedbackSound = async (isCorrect) => {
        if (!soundEnabled) return;
        try {
            if (isCorrect && correctSoundRef.current) {
                await correctSoundRef.current.replayAsync();
            } else if (!isCorrect && wrongSoundRef.current) {
                await wrongSoundRef.current.replayAsync();
            }
        } catch (error) {
            // Ignore audio playback errors
        }
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
