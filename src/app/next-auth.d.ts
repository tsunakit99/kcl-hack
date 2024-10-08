// next-auth.d.ts

import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            /** ユーザーの一意のID */
            id: string;
        } & DefaultSession['user'];
    }
};