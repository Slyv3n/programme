'use client';

import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

interface InactivityWarningModalProps {
    countdown: number;
    isOpen: boolean;
    onContinue: () => void;
    maxCountdown?: number;
}

export function InactivityWarningModal({
    isOpen,
    onContinue,
    countdown,
    maxCountdown = 15,
}: InactivityWarningModalProps) {
    const circumference = 2 * Math.PI * 45;
    const progress = (countdown / maxCountdown) * circumference;

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent onEscapeKeyDown={(e) => e.preventDefault()}>
                <AlertDialogHeader>
                    <div className="flex flex-col items-center text-center">
                        <div className="h-28 mb-4 relative w-28">
                            <svg className="h-full w-full" viewBox="0 0 100 100">
                                <circle
                                    className="text-gray-200"
                                    cx="50"
                                    cy="50"
                                    fill="transparent"
                                    r="45"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                />
                                <circle
                                    className="duration-1000 linear text-orange-500 transition-all"
                                    cx="50"
                                    cy="50"
                                    fill="transparent"
                                    r="45"
                                    stroke="currentColor"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={circumference - progress}
                                    strokeLinecap="round"
                                    strokeWidth="8"
                                    transform="rotate(-90 50 50)"
                                />
                            </svg>
                            <div className="absolute flex inset-0 items-center justify-center">
                                <span className="font-bold text-4xl text-primary">{countdown}</span>
                            </div>
                        </div>

                        <AlertDialogTitle className="text-2xl">Êtes-vous toujours là ?</AlertDialogTitle>
                        <AlertDialogDescription className="text-base">
                            Pour des raisons de sécurité, votre session va bientôt expirer.
                        </AlertDialogDescription>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction className="py-6 text-lg w-full" onClick={onContinue}>
                        Continuer ma commande
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}