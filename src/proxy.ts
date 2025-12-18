import { GlueSessionData, ironOptions } from '@lib/sessionOptions';
import { getIronSession, IronSession } from 'iron-session';
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
    const response = NextResponse.next();
    const session = await getIronSession<GlueSessionData>(request, response, ironOptions);

    const token = session.token;
    const pathname = request.nextUrl.pathname;

    // API 라우트 처리
    if (pathname.startsWith('/api')) {
        const requestHeaders = new Headers(request.headers);
        const customHeader: { 'x-forwarded-for'?: string } = {};

        if (request.headers.get('x-forwarded-for')) {
            customHeader['x-forwarded-for'] =
                request.headers.get('x-forwarded-for') || undefined;
        }
        // 필요시 헤더 추가
        // requestHeaders.set('x-custom-header', JSON.stringify(customHeader));

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    }

    // 로그인 및 인증 관련 페이지 접근 시
    if (pathname === '/login' || pathname.startsWith('/auth')) {
        if (token) {
            try {
                // 이미 로그인 된 상태라면 세션 유효성 검사 후 대시보드로 리다이렉트
                await verifySession({ token });
                return NextResponse.redirect(new URL('/dashboard', request.url));
            } catch (e) {
                // 세션/토큰이 유효하지 않으면 로그인 페이지 허용
                // (유효하지 않은 토큰은 세션에서 제거하는 것이 좋음 - 여기서는 생략하거나 추가 처리 가능)
                return NextResponse.next();
            }
        } else {
            // 토큰 없으면 로그인 페이지 허용
            return NextResponse.next();
        }
    } else {
        // 보호된 라우트 접근 시 (대시보드 등)
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            await verifySession({ token });
            // 여기서 역할(Role) 검사 등을 추가할 수 있습니다.
            // if (requiresRoleGuard(pathname) && !hasAccessToPath(roles, pathname)) { ... }

            return NextResponse.next();
        } catch (e) {
            // 토큰 검증 실패 시 로그인 페이지로
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|image).*)'],
};

// Firebase ID Token 검증 (Google Identity Toolkit API 사용)
const verifySession = async ({ token }: { token: string }) => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;

    const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken: token }),
        },
    );

    if (!res.ok) {
        throw new Error('NOT_VALID_TOKEN');
    }

    const data = await res.json();
    return data; // 사용자 정보 포함
};