'use client';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUIStore } from "@/store/ui-store";
import { AlertTriangle, Info, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { startNavigation } = useUIStore();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const sessionExpiredMessage = searchParams.get('error') === 'SessionExpired'
        ? "Votre session a expiré pour inactivité."
        : null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                username,
                password,
            });

            if (result?.error) {
                setError("Identifiants incorrects. Veuillez réessayer.");
                setIsLoading(false);
            } else {
                startNavigation();
                router.push('/admin');
            }
        } catch {
            setError("Une erreur de réseau est survenue.");
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen">
            <Card className="w-[400px]">
                <CardHeader className="text-center">
                    <CardTitle>Connexion Admin</CardTitle>
                    <CardDescription>Accès à l&apos;interface de gestion</CardDescription>
                </CardHeader>
                <CardContent>
                    {sessionExpiredMessage && (
                        <Alert className="bg-blue-50 border-blue-200 mb-4 text-blue-800">
                            <Info className="h-4 text-blue-500 w-4" />
                            <AlertTitle>Information</AlertTitle>
                            <AlertDescription>
                                {sessionExpiredMessage}
                            </AlertDescription>
                        </Alert>
                    )}

                    {error && (
                        <Alert className="mb-4" variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Erreur de connexion</AlertTitle>
                            <AlertDescription>
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="gap-4 grid items-center w-full">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="username">Nom d&apos;utilisateur</Label>
                                <Input
                                    id="username"
                                    onChange={e => setUsername(e.target.value)}
                                    value={username}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Mot de passe</Label>
                                <Input
                                    id="password"
                                    onChange={e => setPassword(e.target.value)}
                                    type="password"
                                    value={password}
                                />
                            </div>
                            <Button className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="animate-spin h-4 mr-2" />}
                                {isLoading ? 'Connexion...' : 'Se connecter'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}