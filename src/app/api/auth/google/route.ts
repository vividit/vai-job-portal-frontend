import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // For OAuth, we should redirect directly to the backend
    // because OAuth flows require browser redirects, not API responses
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const oauthUrl = `${backendUrl}/auth/google`;
    
    console.log('Redirecting to OAuth URL:', oauthUrl);
    
    // Direct redirect to backend OAuth endpoint
    return NextResponse.redirect(oauthUrl);
    
  } catch (error) {
    console.error('OAuth proxy error:', error);
    
    // Backend not available - redirect to login with error
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'Authentication service temporarily unavailable');
    return NextResponse.redirect(loginUrl);
  }
}
