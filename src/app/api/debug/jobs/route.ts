import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    
    if (!authorization) {
      return NextResponse.json(
        { success: false, message: 'No authorization header' },
        { status: 401 }
      );
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    
    const jobsResponse = await fetch(`${backendUrl}/api/jobs`, {
      headers: { 'Authorization': authorization, 'Content-Type': 'application/json' }
    });

    if (!jobsResponse.ok) {
      return NextResponse.json(
        { success: false, message: 'Failed to fetch jobs' },
        { status: jobsResponse.status }
      );
    }

    const jobsData = await jobsResponse.json();
    const jobs = Array.isArray(jobsData.data) ? jobsData.data : [];

    // Debug information
    const debugInfo = {
      totalJobs: jobs.length,
      statusBreakdown: {},
      isActiveBreakdown: { true: 0, false: 0, undefined: 0 },
      sampleJobs: jobs.slice(0, 5).map(job => ({
        id: job._id || job.id,
        title: job.title,
        status: job.status,
        isActive: job.isActive,
        company: job.company
      }))
    };

    // Count status breakdown
    jobs.forEach(job => {
      const status = job.status || 'undefined';
      debugInfo.statusBreakdown[status] = (debugInfo.statusBreakdown[status] || 0) + 1;
      
      const isActive = job.isActive;
      if (isActive === true) debugInfo.isActiveBreakdown.true++;
      else if (isActive === false) debugInfo.isActiveBreakdown.false++;
      else debugInfo.isActiveBreakdown.undefined++;
    });

    // Calculate different active job counts
    const activeJobCounts = {
      statusOpen: jobs.filter(job => job.status === 'open').length,
      statusActive: jobs.filter(job => job.status === 'active').length,
      isActiveTrue: jobs.filter(job => job.isActive === true).length,
      isActiveNotFalse: jobs.filter(job => job.isActive !== false).length,
      statusOpenAndActiveTrue: jobs.filter(job => job.status === 'open' && job.isActive === true).length,
      statusOpenOrActiveAndNotFalse: jobs.filter(job => 
        (job.status === 'open' || job.status === 'active') && 
        (job.isActive === true || job.isActive === undefined)
      ).length,
    };

    return NextResponse.json({
      success: true,
      data: {
        debugInfo,
        activeJobCounts,
        rawJobsCount: jobs.length
      }
    });

  } catch (error) {
    console.error('Debug jobs fetch error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Failed to fetch debug info' },
      { status: 503 }
    );
  }
}
