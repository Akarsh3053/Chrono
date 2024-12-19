import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', "/", "/api(.*)"])

export default clerkMiddleware(async (auth, request) => {
    if (!isPublicRoute(request)) {
        await auth.protect()
    }
})
export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)'
    ],
};



// export default authMiddleware({
//     publicRoutes: [
//         '/',
//         '/api/clerk-webhook',
//         '/api/drive-activity/notification',
//         '/api/payment/success',
//     ],
//     ignoredRoutes: [
//         '/api/auth/callback/discord',
//         '/api/auth/callback/notion',
//         '/api/auth/callback/slack',
//         '/api/flow',
//         '/api/cron/wait',
//     ],
// })

