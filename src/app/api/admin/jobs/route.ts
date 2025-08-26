import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    console.log('🔑 Authorization header:', authorization ? 'Present' : 'Missing');
    
    if (!authorization) {
      return NextResponse.json(
        { success: false, message: 'No authorization header' },
        { status: 401 }
      );
    }

    // Extract search parameters from the frontend request
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';
    const company = searchParams.get('company');
    const type = searchParams.get('type');
    const source = searchParams.get('source');
    const search = searchParams.get('search');
    const dateFrom = searchParams.get('dateFrom');
    const session = searchParams.get('session');

    // Build query parameters for backend
    const backendParams = new URLSearchParams();
    backendParams.append('page', page);
    backendParams.append('limit', limit);
    
    if (company) backendParams.append('company', company);
    if (type) backendParams.append('type', type);
    if (source) backendParams.append('source', source);
    if (search) backendParams.append('search', search);
    if (dateFrom) backendParams.append('dateFrom', dateFrom);
    if (session) backendParams.append('session', session);

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const fullBackendUrl = `${backendUrl}/api/jobs/admin-all?${backendParams.toString()}`;
    
    console.log('Fetching from backend:', fullBackendUrl);
    
    const backendResponse = await fetch(fullBackendUrl, {
      method: 'GET',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json',
      },
    });

    console.log('Backend response status:', backendResponse.status);
    console.log('Backend response headers:', backendResponse.headers);
    
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('Backend error response:', errorText);
      return NextResponse.json(
        { success: false, message: 'Backend error', error: errorText },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log('Backend response data:', JSON.stringify(data, null, 2));
    
    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error('Admin jobs fetch error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Failed to fetch jobs' },
      { status: 503 }
    );
  }
}
