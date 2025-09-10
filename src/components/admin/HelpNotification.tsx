'use client';

import Pusher from "pusher-js";
import { useEffect, useRef, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Siren } from "lucide-react";

export function HelpNotification() {
    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState('');
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        });

        const channel = pusherClient.subscribe('admin-notifications');

        channel.bind('help-request', (data: { message: string }) => {
            setMessage(data.message);
            setShowNotification(true);
            audioRef.current?.play();
        });

        return () => {
            pusherClient.unsubscribe('admin-notifications');
        };
    }, []);

    return (
        <>
            <AlertDialog onOpenChange={setShowNotification} open={showNotification}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="bg-red-100 mb-4 mx-auto p-3 rounded-full w-fit">
                            <Siren className="h-10 text-red-500 w-10" />
                        </div>
                        <AlertDialogTitle className="text-2xl text-center">Demande d&apos;Aide !</AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-lg">{message}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction className="w-full" onClick={() => setShowNotification(false)}>J&apos;ai compris</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <audio preload="auto" ref={audioRef} src="/sounds/notification.mp3" />
        </>
    );
}