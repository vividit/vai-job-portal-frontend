import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    console.log('🔑 Authorization header for robots test:', authorization ? 'Present' : 'Missing');
    
    if (!authorization) {
      return NextResponse.json(
        { success: false, message: 'No authorization header' },
        { status: 401 }
      );
    }

    const requestBody = await request.json();
    console.log('📦 Robots test request body:', requestBody);

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const fullBackendUrl = `${backendUrl}/api/crawler/test-robots`;
    
    console.log('📡 Sending robots test request to backend:', fullBackendUrl);
    
    const backendResponse = await fetch(fullBackendUrl, {
      method: 'POST',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📊 Backend robots test response status:', backendResponse.status);
    
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('❌ Backend robots test error response:', errorText);
      return NextResponse.json(
        { success: false, message: 'Backend robots test error', error: errorText },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log('✅ Robots test response data:', data);
    
    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error('❌ Robots test fetch error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Failed to test robots compliance', error: error.message },
      { status: 503 }
    );
  }
}
