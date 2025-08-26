import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const fullBackendUrl = `${backendUrl}/api/crawler/test-connection`;
    
    console.log('🔗 Testing connection to backend:', fullBackendUrl);
    
    const backendResponse = await fetch(fullBackendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📊 Backend test connection response status:', backendResponse.status);
    
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('❌ Backend test connection error response:', errorText);
      return NextResponse.json(
        { success: false, message: 'Backend connection failed', error: errorText },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log('✅ Backend test connection success:', data);
    
    return NextResponse.json({
      ...data,
      frontendTimestamp: new Date().toISOString(),
      backendUrl: fullBackendUrl
    }, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error('❌ Frontend connection test error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Frontend connection test failed', error: error.message },
      { status: 503 }
    );
  }
}
