import { apiServerHandler } from '@lib/apiServerHandler';
import { NextResponse } from 'next/server';

export const POST = apiServerHandler(async (req, res, session) => {
    try {
        const { token, email } = await req.json();

        if (token) {
            session.isLoggedIn = true;
            session.token = token;
            session.email = email;
            await session.save();

            return NextResponse.json({ ok: true });
        }

        return NextResponse.json(
            { ok: false, error: 'No token provided' },
            { status: 400 },
        );
    } catch (error) {
        return NextResponse.json(
            { ok: false, error: (error as Error).message },
            { status: 500 },
        );
    }
});
