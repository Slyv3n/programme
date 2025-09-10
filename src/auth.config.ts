import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 60,
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnProtectedPage = nextUrl.pathname.startsWith('/admin') || nextUrl.pathname.startsWith('/kitchen');

            const isOnLoginPage = nextUrl.pathname.startsWith('/login');

            if (isOnProtectedPage) {
                if (isLoggedIn) return true;
                return false;
            }

            if (isLoggedIn && isOnLoginPage) {
                return Response.redirect(new URL('/admin/products', nextUrl));
            }
            
            return true;
        },
    },
    providers: [],
} satisfies NextAuthConfig;