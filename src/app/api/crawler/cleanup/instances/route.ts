import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const fullBackendUrl = `${backendUrl}/api/crawler/cleanup/instances`;
    
    console.log(`📡 Cleaning up crawler instances at backend:`, fullBackendUrl);
    
    const backendResponse = await fetch(fullBackendUrl, {
      method: 'POST',
      headers: {
        'Authorization': authorization || '',
        'Content-Type': 'application/json',
      },
    });

    console.log('📊 Backend cleanup response status:', backendResponse.status);
    
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('❌ Backend cleanup error response:', errorText);
      return NextResponse.json(
        { success: false, message: 'Backend cleanup error', error: errorText },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log('✅ Cleanup result:', data);
    
    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error('❌ Cleanup fetch error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Failed to cleanup crawler instances', error: error.message },
      { status: 503 }
    );
  }
}
