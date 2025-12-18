import { apiServerHandler } from '@lib/apiServerHandler';
import { NextResponse } from 'next/server';
import { GlueSessionData } from '@lib/sessionOptions';

export const GET = apiServerHandler(
    async (req: Request, res: Response, session: GlueSessionData) => {
        const token = session.token;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized: No token found' }, { status: 401 });
        }

        const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
        const firebaseVerifyUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`;

        const response = await fetch(firebaseVerifyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idToken: token,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.error?.message || 'Failed to fetch user info from Firebase' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    },
);
