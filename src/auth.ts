import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./lib/prisma";
import bcrypt from "bcrypt";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials: Partial<Record<string, unknown>>) {
                const username = credentials.username as string | undefined;
                const password = credentials.password as string | undefined;

                if (!username || !password) return null;

                const user = await prisma.adminUser.findUnique({
                    where: { username },
                });

                if (!user) return null;

                const passwordsMatch = await bcrypt.compare(password, user.password);

                if (passwordsMatch) {
                    return { id: user.id.toString(), name: user.username };
                }

                return null;
            },
        }),
    ],
});