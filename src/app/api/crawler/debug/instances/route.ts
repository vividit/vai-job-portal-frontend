import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const fullBackendUrl = `${backendUrl}/api/crawler/debug/instances`;
    
    console.log(`📡 Fetching debug crawler instances from backend:`, fullBackendUrl);
    
    const backendResponse = await fetch(fullBackendUrl, {
      method: 'GET',
      headers: {
        'Authorization': authorization || '',
        'Content-Type': 'application/json',
      },
    });

    console.log('📊 Backend debug response status:', backendResponse.status);
    
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('❌ Backend debug error response:', errorText);
      return NextResponse.json(
        { success: false, message: 'Backend debug error', error: errorText },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log('✅ Debug crawler instances:', data);
    
    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error('❌ Debug fetch error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Failed to fetch debug crawler instances', error: error.message },
      { status: 503 }
    );
  }
}
