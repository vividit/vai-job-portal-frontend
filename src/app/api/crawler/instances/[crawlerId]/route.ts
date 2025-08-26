import { NextRequest, NextResponse } from 'next/server';

const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { crawlerId: string } }
) {
  try {
    const { crawlerId } = params;
    
    // Get auth token from headers
    const authHeader = request.headers.get('Authorization');
    
    // Forward request to backend
    const response = await fetch(`${backendUrl}/api/crawler/instances/${crawlerId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in crawler delete proxy:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete crawler' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { crawlerId: string } }
) {
  try {
    const { crawlerId } = params;
    const body = await request.json();
    
    // Get auth token from headers
    const authHeader = request.headers.get('Authorization');
    
    // Forward request to backend
    const response = await fetch(`${backendUrl}/api/crawler/instances/${crawlerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in crawler update proxy:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update crawler' },
      { status: 500 }
    );
  }
}
