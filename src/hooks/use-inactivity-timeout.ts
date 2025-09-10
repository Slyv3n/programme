'use client';

import { useCartStore } from "@/store/cart-store";
import { useCallback, useEffect, useRef, useState } from "react";
import { useKioskNavigation } from "./use-kiosk-navigation";

interface InactivityTimeoutProps {
    enabled?: boolean;
    timeout?: number;
    warningTimeout?: number;
}

export function useInactivityTimeout({
    enabled = true,
    timeout = 30000,
    warningTimeout = 15000
}: InactivityTimeoutProps = {}) {
    const { clearCart } = useCartStore.getState();
    const { navigate } = useKioskNavigation();

    const [isWarningVisible, setIsWarningVisible] = useState(false);
    const [countdown, setCountdown] = useState(warningTimeout / 1000);

    const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
    const warningTimerRef = useRef<NodeJS.Timeout | null>(null);

    const handleFinalTimeout = useCallback(() => {
        setIsWarningVisible(false);
        clearCart();
        navigate('/');
    }, [clearCart, navigate]);

    const showWarning = useCallback(() => {
        setIsWarningVisible(true);
        setCountdown(warningTimeout / 1000);
        warningTimerRef.current = setTimeout(handleFinalTimeout, warningTimeout);
        countdownIntervalRef.current = setInterval(() => {
            setCountdown(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
    }, [warningTimeout, handleFinalTimeout]);

    const resetTimer = useCallback(() => {
        if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        setIsWarningVisible(false);
        inactivityTimerRef.current = setTimeout(showWarning, timeout);
    }, [timeout, showWarning]);

    useEffect(() => {
        if (!enabled) return;

        const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll'];
        events.forEach(event => window.addEventListener(event, resetTimer));
        resetTimer();

        return () => {
            events.forEach(event => window.removeEventListener(event, resetTimer));
            if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
            if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        };
    }, [resetTimer, enabled]);

    return { isWarningVisible, countdown, continueSession: resetTimer };
}