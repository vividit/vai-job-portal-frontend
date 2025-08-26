# Backend Integration Guide

## 🔗 Connecting Frontend to Your MongoDB Backend

### Current Setup

The frontend is configured to connect to your existing MongoDB backend with OAuth2. Here's how it works:

### 📁 Configuration Files

1. **`src/config/api.ts`** - API endpoint configuration
2. **`next.config.ts`** - Next.js proxy to your backend
3. **`src/contexts/AuthContext.tsx`** - Authentication logic
4. **`src/app/auth/callback/page.tsx`** - OAuth callback handler

### 🚀 Quick Start

1. **Start your backend** on `http://localhost:5000`
2. **Start the frontend**: 
   ```bash
   cd vivid-frontend
   npm run dev
   ```
3. **Visit**: `http://localhost:3000`

### 🔧 Backend Requirements

Your backend should have these endpoints:

```typescript
// Authentication endpoints
POST /api/auth/login
POST /api/auth/signup  
GET  /api/auth/me
GET  /api/auth/google     // OAuth redirect
GET  /api/auth/github     // OAuth redirect
```

### 📝 Expected Request/Response Format

#### Login Request
```typescript
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login Response (Success)
```typescript
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "userType": "job_seeker", // or "recruiter", "consultant", "admin"
    "company": "Company Name", // for recruiters/consultants
    "jobTitle": "Position",    // for recruiters/consultants
    "isVerified": true,
    "createdAt": "2023-12-01T00:00:00Z"
  }
}
```

#### Signup Request
```typescript
POST /api/auth/signup
{
  "userType": "job_seeker", // or "recruiter", "consultant", "admin"
  "firstName": "John",
  "lastName": "Doe", 
  "email": "user@example.com",
  "password": "password123",
  "company": "Company Name",     // for recruiters/consultants
  "jobTitle": "Position",        // for recruiters/consultants
  "agreeToTerms": true
}
```

#### User Verification Request
```typescript
GET /api/auth/me
Headers: {
  "Authorization": "Bearer jwt_token_here"
}
```

### 🔐 OAuth2 Flow

1. **Frontend redirects** to: `http://localhost:5000/api/auth/google`
2. **Your backend handles** Google OAuth
3. **Backend redirects back** to: `http://localhost:3000/auth/callback?token=JWT&user=USER_DATA`
4. **Frontend processes** callback and logs user in

### 🛠 Backend Configuration Needed

Your backend OAuth routes should redirect to:
```
Success: http://localhost:3000/auth/callback?token=JWT_TOKEN&user=ENCODED_USER_DATA
Error:   http://localhost:3000/auth/callback?error=ERROR_MESSAGE
```

### 📊 User Types Supported

The frontend supports these 4 user types:
- `job_seeker` - Job seekers looking for opportunities  
- `recruiter` - Recruiters posting jobs and hiring
- `consultant` - Consultants managing clients and placements
- `admin` - Platform administrators

### 🎯 Different Dashboards

Each user type gets a customized dashboard:
- **Job Seekers**: Applications, AI matches, profile completion
- **Recruiters**: Job management, candidate pipeline, analytics  
- **Consultants**: Client projects, candidate matching, performance
- **Admins**: Platform overview, user management, system health

### ⚙️ Environment Variables

Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_OAUTH_REDIRECT_URL=http://localhost:3000/auth/callback
```

### 🔄 Development vs Production

- **Development**: Uses Next.js proxy (`/api/*` → `http://localhost:5000/api/*`)
- **Production**: Set `NEXT_PUBLIC_API_URL` to your production backend URL

### 🐛 Troubleshooting

**"This page could not be found" errors:**
- Make sure your backend is running on port 5000
- Check that your backend has the required routes
- Restart Next.js dev server after config changes

**CORS errors:**
- The Next.js config includes CORS headers
- Your backend should also allow CORS from `http://localhost:3000`

**OAuth not working:**
- Check your OAuth redirect URLs in Google/GitHub console
- Ensure backend redirects to the correct callback URL

### 📞 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Verify backend is responding on port 5000
3. Test API endpoints with Postman/curl
4. Check Network tab in browser dev tools

The frontend is fully ready for integration! 🎉
