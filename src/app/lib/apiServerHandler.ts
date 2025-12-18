// import {NextResponse} from "next/server";
import { type GlueSessionData, ironOptions } from '@lib/sessionOptions';
import { getIronSession, type IronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Handler 시그니처 타입 정의
type ApiHandler = (
    req: NextRequest,
    res: NextResponse,
    session: IronSession<GlueSessionData>,
    customHeader?: Record<string, unknown>,
) => Promise<NextResponse> | NextResponse;

function apiHandler(handler: ApiHandler) {
    return async function (
        req: NextRequest,
        _context: { params: Promise<Record<string, unknown>> },
    ) {
        const res = NextResponse.next();
        const cookieStore = await cookies();
        const session = await getIronSession<GlueSessionData>(cookieStore, ironOptions);
        const headerRaw = req.headers.get('x-custom-header');
        const customHeader = headerRaw ? { ...JSON.parse(headerRaw) } : undefined;

        try {
            if (
                req.url.includes('/api/auth/login')
            ) {
                return await handler(req, res, session);
            } else {
                if (!session.token) {
                    return NextResponse.json(
                        { error: 'next:세션이 만료되었습니다.' },
                        { status: 401 },
                    );
                }

                return await handler(req, res, session, customHeader);
            }
        } catch (error: any) {
            console.log(error);
            if (error.response) {
                return NextResponse.json(error.response.data, {
                    status: error.response.status,
                });
            } else {
                return NextResponse.json(
                    { error: 'next:Internal Server Error' },
                    { status: 500 },
                );
            }
        }
    };
}

export function apiServerHandler(
    handler: ApiHandler,
): (
    req: NextRequest,
    context: { params: Promise<Record<string, unknown>> },
) => Promise<NextResponse> | NextResponse {
    return apiHandler(handler);
}
