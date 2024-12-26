// middleware.js

import { NextResponse } from 'next/server';


export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('ok'); // Get token from cookies

  // Check if the user is trying to access `/admin` page and is not authenticated
  if (pathname.startsWith('/admin') && !token) {
    // Redirect to the login page if not authenticated
    return NextResponse.redirect(new URL('/auth', req.url));
  }

  // If the user is authenticated or the page is not `/admin`, allow the request
  return NextResponse.next();
}

// Define the paths the middleware should be applied to
export const config = {
  matcher: ['/admin'], // You can list all protected routes here
};
