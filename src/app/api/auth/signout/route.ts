import { getIronSession } from 'iron-session';
import { ironOptions } from '../../../lib/sessionOptions';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    const session = await getIronSession(await cookies(), ironOptions);
    session.destroy();

    return NextResponse.json({ ok: true });
}
