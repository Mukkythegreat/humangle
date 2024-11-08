import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    const publicUrls = ['/', '/signup', '/reset', '/foi-requests', '/send-foi-request', '/contact-us', '/contact-us/api', '/faq', '/api/send-email', '/confirm-email'];

    if (publicUrls.includes(req.nextUrl.pathname)) {
        return res;
    }

    const supabase = createMiddlewareClient({ req, res });

    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();

    // console.log('session', session);

    if (!session) {
        return NextResponse.rewrite(new URL('/login', req.url));
    }

    return res;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
    ]
}