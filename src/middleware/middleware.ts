import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Define protected routes and their required roles
const protectedRoutes = {
  // Admin routes - only for President and Vice President
  '/admin': ['President', 'Vice President'],
  '/admin/members': ['President', 'Vice President'],
  '/admin/divisions': ['President', 'Vice President'],
  '/admin/attendance': ['President', 'Vice President'],
  '/admin/resources': ['President', 'Vice President'],
  '/admin/settings': ['President', 'Vice President'],

  // Division routes - accessible by respective division heads and members
  '/cpd': ['Competitive Programming Division President', 'Member'],
  '/dev': ['Development Division President', 'Member'],
  '/cbd': ['Capacity Building Division President', 'Member'],
  '/sec': ['Cybersecurity Division President', 'Member'],
  '/ds': ['Data Science Division President', 'Member'],

  // Attendance routes - only for division heads and admin
  '/attendance': ['President', 'Vice President', 
    'Competitive Programming Division President',
    'Development Division President',
    'Capacity Building Division President',
    'Cybersecurity Division President',
    'Data Science Division President'
  ],

  // Session and Event routes
  '/sessions/create': ['President', 'Vice President',
    'Competitive Programming Division President',
    'Development Division President',
    'Capacity Building Division President',
    'Cybersecurity Division President',
    'Data Science Division President'
  ],
  '/sessions/edit': ['President', 'Vice President',
    'Competitive Programming Division President',
    'Development Division President',
    'Capacity Building Division President',
    'Cybersecurity Division President',
    'Data Science Division President'
  ],
  '/events/create': ['President', 'Vice President',
    'Competitive Programming Division President',
    'Development Division President',
    'Capacity Building Division President',
    'Cybersecurity Division President',
    'Data Science Division President'
  ],
  '/events/edit': ['President', 'Vice President',
    'Competitive Programming Division President',
    'Development Division President',
    'Capacity Building Division President',
    'Cybersecurity Division President',
    'Data Science Division President'
  ],
};

// Map of division presidents to their respective divisions
const divisionPresidentMap = {
  'Competitive Programming Division President': 'Competitive Programming Division',
  'Development Division President': 'Development Division',
  'Capacity Building Division President': 'Capacity Building Division',
  'Cybersecurity Division President': 'Cybersecurity Division',
  'Data Science Division President': 'Data Science Division',

  
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/register', '/'];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // For protected routes, let the client-side handle authentication
  // The client will check localStorage and redirect if needed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/Competitive Programming Division /:path*',
    '/Development Division/:path*',
    '/Capacity Building Division/:path*',
    '/Cybersecurity Division/:path*',
    '/Data Science Division/:path*',
    '/attendance/:path*',
    '/sessions/:path*',
    '/events/:path*',
    '/main/:path*',
  ],
}; 