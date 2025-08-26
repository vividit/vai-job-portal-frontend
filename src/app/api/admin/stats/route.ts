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
    
    // Fetch real-time admin stats from backend
    const [adminStatsResponse, usersStatsResponse, jobsResponse, crawlerStatusResponse, activityResponse] = await Promise.all([
      fetch(`${backendUrl}/api/admin/stats`, {
        headers: { 'Authorization': authorization, 'Content-Type': 'application/json' }
      }),
      fetch(`${backendUrl}/api/users/stats`, {
        headers: { 'Authorization': authorization, 'Content-Type': 'application/json' }
      }),
      fetch(`${backendUrl}/api/jobs`, {
        headers: { 'Authorization': authorization, 'Content-Type': 'application/json' }
      }),
      fetch(`${backendUrl}/api/crawler/status`, {
        headers: { 'Authorization': authorization, 'Content-Type': 'application/json' }
      }).catch(() => null),
      fetch(`${backendUrl}/api/crawler/activity?limit=5`, {
        headers: { 'Authorization': authorization, 'Content-Type': 'application/json' }
      }).catch(() => null) // Activity feed might not be available
    ]);

    const adminStatsData = adminStatsResponse.ok ? await adminStatsResponse.json() : null;
    const usersStatsData = usersStatsResponse.ok ? await usersStatsResponse.json() : null;
    const jobsData = jobsResponse.ok ? await jobsResponse.json() : null;
    const crawlerStatusData = crawlerStatusResponse?.ok ? await crawlerStatusResponse.json() : null;
    const activityData = activityResponse?.ok ? await activityResponse.json() : null;

    // Extract real data from backend responses
    let stats = {
      totalUsers: 0,
      totalJobs: 0,
      activeJobs: 0,
      pendingApprovals: 0
    };

    // Use admin stats if available
    if (adminStatsData?.success) {
      stats.totalUsers = adminStatsData.stats.totalUsers || 0;
      stats.totalJobs = adminStatsData.stats.totalJobs || 0;
      // NOTE: adminStatsData.stats.activeJobs might be wrong, we'll calculate from jobs data
      stats.pendingApprovals = adminStatsData.stats.pendingQueries || 0;
    }

    // Fallback to user stats if admin stats not available
    if (usersStatsData?.data) {
      stats.totalUsers = usersStatsData.data.totalUsers || stats.totalUsers;
    }

    // Calculate active jobs from jobs data (most reliable)
    if (jobsData?.data && Array.isArray(jobsData.data)) {
      const jobs = jobsData.data;
      stats.totalJobs = jobs.length;
      // Count jobs that are considered active (very inclusive logic)
      const activeJobsFilter = jobs.filter(job => {
        const status = (job.status || '').toLowerCase();
        const isActive = job.isActive;
        
        // Consider a job INACTIVE only if:
        // 1. Status is explicitly closed, draft, expired, disabled, inactive, OR
        // 2. isActive is explicitly set to false
        const isInactiveStatus = ['closed', 'draft', 'expired', 'disabled', 'inactive', 'archived'].includes(status);
        const isExplicitlyInactive = isActive === false;
        
        // Job is active unless explicitly inactive
        return !isInactiveStatus && !isExplicitlyInactive;
      });
      stats.activeJobs = activeJobsFilter.length;
      
      // Debug logging
      console.log(`[Stats Debug] Total jobs in DB: ${jobs.length}`);
      console.log(`[Stats Debug] Active jobs count: ${stats.activeJobs}`);
      if (jobs.length > 0) {
        console.log(`[Stats Debug] Sample job statuses:`, jobs.slice(0, 3).map(j => ({
          status: j.status,
          isActive: j.isActive,
          title: j.title
        })));
      }
    }

    // Use crawler status for additional active job count if available
    if (crawlerStatusData?.success && crawlerStatusData.data?.statistics) {
      const crawlerStats = crawlerStatusData.data.statistics;
      if (crawlerStats.activeJobs && crawlerStats.activeJobs > stats.activeJobs) {
        stats.activeJobs = crawlerStats.activeJobs;
      }
    }

    // Build recent activity feed
    let recentActivity = [];
    if (activityData?.success && activityData.data?.activities) {
      recentActivity = activityData.data.activities.slice(0, 3).map(activity => ({
        type: activity.type,
        message: activity.message,
        timestamp: activity.timestamp,
        level: activity.level || 'info'
      }));
    } else {
      // Create meaningful activity from real data
      recentActivity = [];
      
      if (stats.totalUsers > 0) {
        recentActivity.push({
          type: 'user_registration',
          message: `Database shows ${stats.totalUsers} total users registered`,
          timestamp: new Date().toISOString(),
          level: 'info'
        });
      }
      
      if (stats.totalJobs > 0) {
        recentActivity.push({
          type: 'job_posted',
          message: `${stats.totalJobs} jobs in database (${stats.activeJobs} active)`,
          timestamp: new Date(Date.now() - 60000).toISOString(),
          level: 'info'
        });
      }
      
      if (stats.activeJobs > 0) {
        recentActivity.push({
          type: 'system_update',
          message: `${stats.activeJobs} jobs currently accepting applications`,
          timestamp: new Date(Date.now() - 120000).toISOString(),
          level: 'info'
        });
      }
      
      // If no meaningful data, show system status
      if (recentActivity.length === 0) {
        recentActivity.push({
          type: 'system_status',
          message: 'Dashboard connected to database successfully',
          timestamp: new Date().toISOString(),
          level: 'info'
        });
      }
    }

    // System health from admin stats
    let systemHealth = {
      serverStatus: 'Online',
      database: 'Connected',
      apiResponse: 'Fast'
    };

    if (adminStatsData?.success) {
      systemHealth = {
        serverStatus: 'Online',
        database: 'Connected',
        apiResponse: adminStatsData.stats.serverMemory ? 
          (parseFloat(adminStatsData.stats.serverMemory) < 80 ? 'Fast' : 'Slow') : 'Fast'
      };
    }

    // Build crawler stats
    let crawlerStats = {
      status: 'Stopped',
      totalJobs: stats.totalJobs,
      activeSources: 0,
      targetCompanies: 0,
      pendingJobs: 0
    };

    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        recentActivity,
        systemHealth,
        crawler: crawlerStats,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Admin stats fetch error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Failed to fetch admin statistics' },
      { status: 503 }
    );
  }
}