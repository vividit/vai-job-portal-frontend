# Vai Job Portal - Complete Setup Guide

## Repository Structure
- **Backend**: https://github.com/vividit/vai-job-portal-backend
- **Frontend**: https://github.com/vividit/vai-job-portal-frontend

## Setup Instructions

### 1. Clone the Backend Repository
```bash
git clone https://github.com/vividit/vai-job-portal-backend.git
cd vai-job-portal-backend
```

### 2. Clone the Frontend Inside Backend
```bash
# Clone frontend repository inside the backend directory
git clone https://github.com/vividit/vai-job-portal-frontend.git vai-frontend
cd vai-frontend
```

### 3. Setup Frontend
```bash
# Install frontend dependencies
npm install

# Run frontend development server
npm run dev
```

The frontend will typically run on `http://localhost:3000`

### 4. Setup Backend
```bash
# Go back to backend directory
cd ..

# Install backend dependencies
npm install

# Create .env file with your configuration
# Copy .env.example if available, or create new .env file
cp .env.example .env
```

### 5. Configure Environment Variables
Create/edit `.env` file in the backend root with your settings:
```env
# Database
DATABASE_URL=your_database_url
MONGODB_URI=your_mongodb_connection_string

# API Keys (replace with your actual keys)
OPENAI_API_KEY=your_openai_api_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key
```

### 6. Start Backend Server
```bash
# Start the backend server
npm start
```

The backend will typically run on `http://localhost:5000`

## Development Workflow

### Running Both Servers
You'll need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd vai-job-portal
npm start
```

**Terminal 2 - Frontend:**
```bash
cd vai-job-portal/vai-frontend
npm run dev
```

### Project Structure
```
vai-job-portal/                 # Backend repository
├── vai-frontend/              # Frontend repository (cloned inside)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── src/                       # Backend source
├── package.json               # Backend package.json
├── .env                       # Backend environment variables
└── ...
```

## Important Notes

1. **Environment Variables**: Never commit actual API keys to Git. Use `.env.example` files with placeholder values.

2. **Git Management**: The frontend has its own Git repository inside the backend directory. Update them separately:
   ```bash
   # Update backend
   git add . && git commit -m "Backend changes" && git push
   
   # Update frontend
   cd vai-frontend
   git add . && git commit -m "Frontend changes" && git push
   cd ..
   ```

3. **Database**: Make sure your database is running and accessible with the connection string in `.env`

4. **CORS**: The backend should be configured to allow requests from the frontend URL.

## Troubleshooting

### Frontend Issues
- Check if Node.js version is compatible
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Backend Issues  
- Verify `.env` file has correct values
- Check database connection
- Ensure all required environment variables are set

### Port Conflicts
- Frontend default: `http://localhost:3000`
- Backend default: `http://localhost:5000`
- Change ports in package.json scripts if needed

## Quick Start Commands

```bash
# One-time setup
git clone https://github.com/vividit/vai-job-portal.git
cd vai-job-portal
git clone https://github.com/vividit/vai-job-portal-frontend.git vai-frontend
cd vai-frontend && npm install && cd ..
npm install

# Daily development
# Terminal 1:
npm start

# Terminal 2:
cd vai-frontend && npm run dev
```
