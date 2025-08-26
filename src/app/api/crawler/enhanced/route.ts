import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    console.log('🔑 Authorization header for enhanced crawler:', authorization ? 'Present' : 'Missing');
    
    if (!authorization) {
      return NextResponse.json(
        { success: false, message: 'No authorization header' },
        { status: 401 }
      );
    }

    const requestBody = await request.json();
    console.log('📦 Enhanced crawler request body:', requestBody);

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const fullBackendUrl = `${backendUrl}/api/crawler/enhanced`;
    
    console.log('📡 Sending enhanced crawler request to backend:', fullBackendUrl);
    
    const backendResponse = await fetch(fullBackendUrl, {
      method: 'POST',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📊 Backend enhanced crawler response status:', backendResponse.status);
    
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('❌ Backend enhanced crawler error response:', errorText);
      return NextResponse.json(
        { success: false, message: 'Backend crawler error', error: errorText },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log('✅ Enhanced crawler response data:', JSON.stringify(data, null, 2));
    
    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error('❌ Enhanced crawler fetch error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Failed to start enhanced crawler', error: error.message },
      { status: 503 }
    );
  }
}
