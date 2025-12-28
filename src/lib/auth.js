import CredentialsProvider from 'next-auth/providers/credentials';

/**
 * NextAuth Configuration
 * Using DummyJSON auth API for authentication
 * Endpoint: POST https://dummyjson.com/auth/login
 */

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                try {
                    const res = await fetch('https://dummyjson.com/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            username: credentials?.username,
                            password: credentials?.password,
                        }),
                    });

                    const user = await res.json();

                    if (res.ok && user) {
                        // Return user object with token
                        return {
                            id: user.id,
                            name: `${user.firstName} ${user.lastName}`,
                            email: user.email,
                            image: user.image,
                            username: user.username,
                            accessToken: user.accessToken,
                            refreshToken: user.refreshToken,
                        };
                    }

                    return null;
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Initial sign in
            if (user) {
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.id = user.id;
                token.username = user.username;
                token.image = user.image;
            }
            return token;
        },
        async session({ session, token }) {
            // Add token to session
            session.accessToken = token.accessToken;
            session.user.id = token.id;
            session.user.username = token.username;
            session.user.image = token.image;
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 24 hours
    },
    secret: process.env.NEXTAUTH_SECRET || 'your-super-secret-key-change-in-production',
};
