# Installation Guide

Complete guide to installing and setting up Pensiv locally.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation Steps](#installation-steps)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Docker Installation](#docker-installation)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js** - v20.x or higher
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify: `node --version`

- **pnpm** - v10.x or higher (recommended) or npm
  - Install: `npm install -g pnpm`
  - Verify: `pnpm --version`

- **MongoDB** - v8.x or higher
  - **Local Installation**: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
  - **Cloud Option**: Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
  - Verify: `mongod --version`

- **Git** - For cloning the repository
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify: `git --version`

### Optional Software

- **Docker** - For containerized deployment
  - Download from [docker.com](https://www.docker.com/get-started)
  - Verify: `docker --version`

- **Postman** - For API testing
  - Download from [postman.com](https://www.postman.com/downloads/)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/AnuragDahal/pensiv.git
cd pensiv
```

### 2. Install Backend Dependencies

```bash
cd backend
pnpm install
```

If you encounter any errors, try:
```bash
pnpm install --force
```

### 3. Install Frontend Dependencies

```bash
cd ../client
pnpm install
```

## Environment Configuration

### Backend Environment Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your configuration:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database
   # Local MongoDB
   MONGO_URI=mongodb://localhost:27017/pensiv

   # OR MongoDB Atlas (recommended for production)
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pensiv?retryWrites=true&w=majority

   # JWT Secrets (IMPORTANT: Generate strong random strings)
   # You can generate these using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ACCESS_TOKEN_SECRET=your_generated_access_token_secret_here
   REFRESH_TOKEN_SECRET=your_generated_refresh_token_secret_here

   # Frontend URL
   FRONTEND_URL=http://localhost:3000

   # Email Configuration (Optional - for notifications)
   GMAIL_USER=your_gmail_address@gmail.com
   GMAIL_PASS=your_gmail_app_password

   # Supabase (Optional - for image uploads)
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_anon_key
   SUPABASE_BUCKET=your_bucket_name

   # ImageKit (Optional - alternative image hosting)
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

   # Stripe (Optional - for payments/monetization)
   STRIPE_SECRET_KEY=your_stripe_secret_key

   # Unsplash API Keys (Optional - for cover image search)
   UNSPLASH_ACCESS_KEY=your_unsplash_access_key
   UNSPLASH_ACCESS_KEY2=your_unsplash_access_key2
   UNSPLASH_SECRET_KEY2=your_unsplash_secret_key2
   ```

#### Generating JWT Secrets

Use Node.js crypto to generate strong secrets:

```bash
# Generate ACCESS_TOKEN_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate REFRESH_TOKEN_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and paste into your `.env` file.

#### Setting Up MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `<database>` with `pensiv`
8. Paste into `MONGO_URI` in your `.env` file

#### Setting Up Supabase (Optional - for image uploads)

1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Go to Storage → Create a new bucket (e.g., "article-images")
4. Set bucket to public
5. Copy your project URL and anon key from Settings → API
6. Add to your `.env` file

### Frontend Environment Setup

1. Navigate to the client directory:
   ```bash
   cd ../client
   ```

2. Create a `.env.local` file:
   ```bash
   touch .env.local
   ```

3. Add the following:
   ```env
   # Backend API URL
   NEXT_PUBLIC_API_URL=http://localhost:5000

   # Optional: Supabase (if using for image uploads)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Database Setup

### Option 1: Empty Database

The application will automatically create necessary collections on first run.

### Option 2: Seed Database with Sample Data

To populate your database with sample articles, users, and comments:

```bash
cd backend
pnpm run seed:full
```

This creates:
- 5 sample users
- 20 sample articles with various categories
- Sample comments and interactions
- Featured posts

**Note**: Seeding is optional but recommended for testing and development.

## Running the Application

### Development Mode

You'll need **two terminal windows** - one for backend, one for frontend.

#### Terminal 1: Backend

```bash
cd backend
pnpm dev
```

Output should show:
```
Server is running on port 5000
MongoDB Connected: <your-cluster>.mongodb.net
```

The backend API runs on `http://localhost:5000`

#### Terminal 2: Frontend

```bash
cd client
pnpm dev
```

Output should show:
```
▲ Next.js 16.0.0
- Local:        http://localhost:3000
- Ready in 1.2s
```

The frontend runs on `http://localhost:3000`

### Production Build

#### Backend Production

```bash
cd backend
pnpm build
pnpm prod
```

#### Frontend Production

```bash
cd client
pnpm build
pnpm start
```

## Docker Installation

### Prerequisites

- Docker Desktop installed
- Docker Compose installed

### Using Docker Compose

1. Make sure your `.env` files are configured (see above)

2. Build and start all services:
   ```bash
   docker-compose up -d
   ```

   This starts:
   - MongoDB on `localhost:27017`
   - Backend API on `http://localhost:5000`
   - Frontend on `http://localhost:3000`

3. View logs:
   ```bash
   docker-compose logs -f
   ```

4. Stop all services:
   ```bash
   docker-compose down
   ```

5. Stop and remove all data:
   ```bash
   docker-compose down -v
   ```

### Docker Commands Reference

```bash
# Build images without cache
docker-compose build --no-cache

# Start specific service
docker-compose up backend

# Restart a service
docker-compose restart frontend

# Execute command in running container
docker-compose exec backend pnpm run seed:full

# View running containers
docker ps
```

## Troubleshooting

### Common Issues

#### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

#### MongoDB Connection Failed

**Error**: `MongoServerError: bad auth`

**Solution**:
- Check `MONGO_URI` in `.env` is correct
- Verify database password
- Ensure IP address is whitelisted in MongoDB Atlas (use 0.0.0.0/0 for development)

#### Module Not Found Errors

**Error**: `Cannot find module 'xyz'`

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

#### Build Errors in Next.js

**Error**: `Module parse failed: Unexpected token`

**Solution**:
```bash
# Clear Next.js cache
cd client
rm -rf .next
pnpm build
```

#### Environment Variables Not Loading

**Solution**:
- Ensure `.env` is in the correct directory (backend or client)
- Restart the development server after changing `.env`
- Frontend variables must start with `NEXT_PUBLIC_`
- Check for typos in variable names

#### CORS Errors

**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**:
- Verify `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check that backend is running
- Clear browser cache

### Getting Help

If you're still experiencing issues:

1. Check [GitHub Issues](https://github.com/AnuragDahal/pensiv/issues)
2. Open a new issue with:
   - Detailed error message
   - Steps to reproduce
   - Your environment (OS, Node version, etc.)
3. Join discussions in [GitHub Discussions](https://github.com/AnuragDahal/pensiv/discussions)

## Next Steps

Once installation is complete:

1. **Explore the Application**: Visit `http://localhost:3000`
2. **Create an Account**: Sign up with a test account
3. **Create Your First Post**: Navigate to "Write" and create an article
4. **API Testing**: Import the Postman collection from `backend/postman_collection.json`
5. **Read the Docs**: Check out the [API Documentation](backend/POSTMAN_GUIDE.md)
6. **Contribute**: See [CONTRIBUTING.md](CONTRIBUTING.md) to start contributing

---

Happy coding! If you encounter any issues, don't hesitate to open an issue on GitHub.
