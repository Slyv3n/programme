'use client';

import { InitializationTasks, TaskStatus } from "@/hooks/useAppInitializer";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

const StatusLine = ({ text, status }: { text: string; status: TaskStatus }) => (
    <div className="duration-300 flex font-medium gap-4 items-center text-lg transition-all">
        {status === 'loading' && <Loader2 className="animate-spin h-6 text-orange-500 w-6" />}
        {status === 'success' && <CheckCircle className="h-6 text-green-500 w-6" />}
        {status === 'error' && <XCircle className="h-6 text-red-500 w-6" />}
        <span className={status !== 'loading' ? 'text-gray-500' : 'text-gray-800'}>
            {text}
        </span>
    </div>
);

export function AppLoader({ tasks }: { tasks: InitializationTasks }) {
    return (
        <div className="bg-white flex flex-col h-screen items-center justify-center w-full">
            <div className="space-y-4">
                <StatusLine status={tasks.license} text="Validation de la licence..." />
                <StatusLine status={tasks.settings} text="Chargement des paramètres..." />
                <StatusLine status={tasks.i18n} text="Initialisation des langues..." />
            </div>
        </div>
    );
}