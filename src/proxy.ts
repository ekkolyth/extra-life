import {
    clerkClient,
    clerkMiddleware,
    createRouteMatcher,
} from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { isAdminUser } from '@/convex/lib/admin'

const isAdminRoute = createRouteMatcher(['/debug(.*)', '/config(.*)'])

export default clerkMiddleware(async (auth, req) => {
    if (!isAdminRoute(req)) return
    const { userId } = await auth()
    if (userId) {
        const user = await (await clerkClient()).users.getUser(userId)
        if (isAdminUser(user)) return
    }
    return NextResponse.redirect(new URL('/dashboard', req.url))
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
