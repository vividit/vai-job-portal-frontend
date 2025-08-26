import { NextRequest, NextResponse } from 'next/server';

const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

export async function POST(
  request: NextRequest,
  { params }: { params: { crawlerId: string } }
) {
  try {
    const { crawlerId } = params;
    const body = await request.json();
    
    // Get auth token from headers
    const authHeader = request.headers.get('Authorization');
    
    // Forward request to backend
    const response = await fetch(`${backendUrl}/api/crawler/instances/${crawlerId}/companies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in crawler companies proxy:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add company to crawler' },
      { status: 500 }
    );
  }
}
