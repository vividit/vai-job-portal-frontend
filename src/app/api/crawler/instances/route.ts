import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const fullBackendUrl = `${backendUrl}/api/crawler/instances`;
    
    console.log('📡 Fetching crawler instances from backend:', fullBackendUrl);
    
    const backendResponse = await fetch(fullBackendUrl, {
      method: 'GET',
      headers: {
        'Authorization': authorization || '',
        'Content-Type': 'application/json',
      },
    });

    console.log('📊 Backend crawler instances response status:', backendResponse.status);
    
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('❌ Backend crawler instances error response:', errorText);
      return NextResponse.json(
        { success: false, message: 'Backend crawler instances error', error: errorText },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log('✅ Crawler instances response data:', data);
    
    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error('❌ Crawler instances fetch error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Failed to fetch crawler instances', error: error.message },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    const requestBody = await request.json();
    
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const fullBackendUrl = `${backendUrl}/api/crawler/instances`;
    
    console.log('📡 Creating crawler instance:', requestBody);
    
    const backendResponse = await fetch(fullBackendUrl, {
      method: 'POST',
      headers: {
        'Authorization': authorization || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📊 Backend create crawler response status:', backendResponse.status);
    
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('❌ Backend create crawler error response:', errorText);
      return NextResponse.json(
        { success: false, message: 'Backend create crawler error', error: errorText },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log('✅ Create crawler response data:', data);
    
    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error('❌ Create crawler fetch error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Failed to create crawler instance', error: error.message },
      { status: 503 }
    );
  }
}
