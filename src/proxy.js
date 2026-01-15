
// src/proxy.js
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks/clerk(.*)',
    '/problems',
    '/api/problems',
    '/api/auth/check-admin',
    // '/api/problems(.*)', //
    // '/api/admin/problems(.*)', //
    // '/api/admin/problems/(.*)',//
]);

const isAdminRoute = createRouteMatcher([
    '/admin(.*)',
    '/api/admin(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
    // Resolve the auth object first
    const authObj = await auth();

    // 1. Protect non-public routes
    //Logic: If it is NOT public, they MUST be logged in.
    // This covers both "normal protected routes" and "admin routes".
    // if (!isPublicRoute(req)) {
    //     await authObj.protect();
    // }
    if (!isPublicRoute(req)) {
        // Use redirectToSignIn if protect() isn't available or behaves oddly
        if (!authObj.userId) {
            return authObj.redirectToSignIn({ returnBackUrl: req.url });
        }
    }

    // 2. Protect admin routes
    // (Optional Future Optimization)
    // If you ever add "role" to Clerk session claims, 
    // you would check it here for isAdminRoute(req).
    // if (isAdminRoute(req)) {
    //     if (!authObj.userId) {
    //         return authObj.redirectToSignIn({ returnBackUrl: req.url });
    //     }
    // }
});



export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
