<div align="center">
  <img src="client/public/logo.png" alt="Pensiv Logo" width="200"/>

  # Pensiv

  ### A Modern, Full-Stack Blogging Platform

  *Share your thoughts, build your audience, and manage content with ease*

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)

</div>

---

## 📖 About

**Pensiv** is a production-ready, full-stack content management system designed for modern bloggers, writers, and content creators. Built with a focus on performance, scalability, and developer experience, Pensiv provides everything you need to create, manage, and share compelling content.

The platform features a beautiful, responsive interface with a powerful rich-text editor, real-time engagement metrics, and comprehensive content management tools. Whether you're building a personal blog, a team publication, or a content-driven business, Pensiv scales to meet your needs.

## ✨ Key Features

### Content Management
- **Rich Text Editor** - Powered by TipTap with code highlighting, image embedding, and link support
- **Draft & Publish System** - Save drafts and publish when ready with version control
- **Category & Tags** - Organize content with flexible categorization and tagging
- **Cover Images** - Beautiful featured images with Unsplash integration
- **SEO-Friendly URLs** - Auto-generated slugs for optimal search engine visibility

### User Experience
- **Authentication & Authorization** - Secure JWT-based auth with refresh tokens
- **User Profiles** - Customizable profiles with bio, avatar, and social links
- **Engagement System** - Like, comment, and reply on articles
- **Reading Analytics** - Track views and engagement metrics
- **Featured Posts** - Dynamic featured post selection based on engagement
- **Recommended Articles** - Smart recommendations based on tags and authors

### Technical Excellence
- **Server-Side Rendering** - Fast initial loads with Next.js SSR
- **RESTful API** - Well-documented, production-ready API
- **Real-time Updates** - Instant reaction and comment updates
- **Responsive Design** - Mobile-first, beautiful UI on all devices
- **Dark Mode** - System-aware theme switching
- **Code Syntax Highlighting** - Beautiful code blocks with highlight.js
- **Search & Filtering** - Full-text search across titles, content, tags, and authors

### Developer Features
- **TypeScript** - Full type safety across the stack
- **Modular Architecture** - Clean separation of concerns
- **API Documentation** - Comprehensive Postman collection included
- **Docker Support** - Containerized deployment ready
- **Vercel Optimized** - Serverless deployment configuration
- **Environment Validation** - Runtime environment variable validation with Zod

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives
- **Rich Text Editor**: TipTap with StarterKit, Link, Image, and CodeBlock extensions
- **Code Highlighting**: highlight.js with lowlight integration
- **Image Upload**: Supabase Storage integration for image upload and management
- **HTML Rendering**: Direct HTML rendering with syntax - 
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Theme**: next-themes with dark mode support

### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (access & refresh tokens)
- **Validation**: Zod schemas
- **Password Hashing**: bcryptjs
- **Content Processing**: marked (for generating article previews/descriptions)
- **CORS**: Configured for cross-origin requests

### DevOps & Tools
- **Package Manager**: pnpm
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier
- **Deployment**: Vercel (frontend & backend serverless)
- **Containerization**: Docker & Docker Compose
- **API Testing**: Postman collection with environments

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** - v20.x or higher
- **pnpm** - v10.x or higher (recommended) or npm
- **MongoDB** - v8.x or higher (local or Atlas cluster)
- **Git** - For cloning the repository

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/blog-cms.git
cd blog-cms
```

### 2. Install Dependencies

#### Backend
```bash
cd backend
pnpm install
```

#### Frontend
```bash
cd client
pnpm install
```

### 3. Environment Configuration

#### Backend Setup

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name

# JWT Secrets (generate strong random strings)
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email Configuration (Optional)
GMAIL_USER=your_gmail_username
GMAIL_PASS=your_gmail_password

# ImageKit (Optional)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# Stripe (Optional)
STRIPE_SECRET_KEY=your_stripe_secret_key

# Unsplash API Keys (Optional)
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
UNSPLASH_ACCESS_KEY2=your_unsplash_access_key2
UNSPLASH_SECRET_KEY2=your_unsplash_secret_key2
```

#### Frontend Setup

Create a `.env.local` file in the `client` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Database Setup

The application will automatically connect to MongoDB on startup. Optionally, seed the database with sample data:

```bash
cd backend
pnpm run seed:full
```

### 5. Run the Application

#### Development Mode

**Backend** (in one terminal):
```bash
cd backend
pnpm dev
```
Server runs on `http://localhost:5000`

**Frontend** (in another terminal):
```bash
cd client
pnpm dev
```
Client runs on `http://localhost:3000`

#### Production Build

**Backend**:
```bash
cd backend
pnpm build
pnpm prod
```

**Frontend**:
```bash
cd client
pnpm build
pnpm start
```

### 6. Using Docker (Optional)

Run the entire stack with Docker Compose:

```bash
docker-compose up -d
```

This will start:
- Backend API on `http://localhost:5000`
- Frontend on `http://localhost:3000`
- MongoDB on `localhost:27017`

## 📚 API Documentation

The project includes a comprehensive Postman collection for API testing:

### Import into Postman
1. Open Postman
2. Click **Import**
3. Import `backend/postman_collection.json`
4. Import environment file:
   - `backend/postman_environment_local.json` (for local development)
   - `backend/postman_environment_production.json` (for production)

### API Endpoints Overview

#### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/update` - Update profile
- `PATCH /api/auth/update-password` - Change password
- `POST /api/auth/logout` - Logout

#### Posts
- `GET /api/posts` - Get all published posts (public)
- `GET /api/posts/home` - Get featured and recent posts
- `POST /api/posts` - Create post (auth required)
- `GET /api/posts/:id` - Get single post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `PATCH /api/posts/:id/like` - Like/unlike post

#### Comments
- `POST /api/comments` - Create comment
- `GET /api/comments/:id` - Get comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `PATCH /api/comments/:id/like` - Like/unlike comment
- `POST /api/comments/reply/:id` - Reply to comment

**Detailed Documentation**: See `backend/POSTMAN_GUIDE.md` for complete API reference

## 📁 Project Structure

```
blog-cms/
├── backend/                    # Backend API server
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── constants/         # Constants and enums
│   │   ├── features/          # Feature modules
│   │   │   ├── auth/         # Authentication
│   │   │   ├── posts/        # Posts management
│   │   │   ├── comments/     # Comments system
│   │   │   └── reaction/     # Likes/reactions
│   │   ├── middlewares/       # Express middlewares
│   │   ├── shared/            # Shared utilities
│   │   ├── types/             # TypeScript types
│   │   └── index.ts           # Entry point
│   ├── scripts/               # Seed scripts
│   ├── dist/                  # Compiled output
│   ├── postman_collection.json
│   ├── POSTMAN_GUIDE.md
│   └── package.json
│
├── client/                     # Frontend Next.js app
│   ├── src/
│   │   ├── app/               # App router pages
│   │   │   ├── (auth)/       # Auth pages (login, signup)
│   │   │   ├── (protected)/  # Protected pages
│   │   │   │   ├── article/  # Article pages
│   │   │   │   ├── dashboard/
│   │   │   │   ├── my-articles/
│   │   │   │   ├── profile/
│   │   │   │   └── settings/
│   │   │   └── page.tsx      # Homepage
│   │   ├── components/        # Reusable components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility libraries
│   │   ├── stores/            # Zustand stores
│   │   └── types/             # TypeScript types
│   ├── public/                # Static assets
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

## 🌐 Deployment

### Vercel Deployment (Recommended)

Both frontend and backend are optimized for Vercel serverless deployment.

#### Backend Deployment
1. Push your code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy with automatic builds on push

#### Frontend Deployment
1. Connect frontend to Vercel
2. Set `NEXT_PUBLIC_API_URL` environment variable
3. Deploy

**Configuration files included**:
- `backend/vercel.json` - Serverless function configuration
- `client/next.config.js` - Next.js optimization

### Docker Deployment

Build and deploy using Docker:

```bash
# Build images
docker-compose build

# Run containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

## 🛠️ Development Scripts

### Backend
```bash
pnpm dev          # Start development server with nodemon
pnpm build        # Build TypeScript to dist/
pnpm prod         # Run production build
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
pnpm seed         # Seed database with sample data
pnpm seed:full    # Comprehensive database seeding
```

### Frontend
```bash
pnpm dev          # Start Next.js dev server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues
pnpm format       # Format code with Prettier
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Refresh Token Rotation** - Enhanced security with refresh tokens
- **Password Hashing** - bcryptjs with salt rounds
- **Input Validation** - Zod schema validation on all inputs
- **CORS Protection** - Configured CORS policies
- **SQL Injection Prevention** - Mongoose ODM protection
- **XSS Prevention** - Sanitized user inputs
- **Environment Variables** - Sensitive data in environment files

## 🎨 UI/UX Features

- **Responsive Design** - Mobile-first approach
- **Skeleton Loading** - Smooth loading states
- **Toast Notifications** - User feedback with Sonner
- **Accessible Components** - ARIA compliant with Radix UI
- **Typography System** - Beautiful, readable content with Tailwind Typography
- **Syntax Highlighting** - Code blocks with highlight.js
- **Rich Text Editing** - WYSIWYG editor with TipTap

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Quality Standards
- Write TypeScript with strict mode
- Follow existing code style (use ESLint/Prettier)
- Add comments for complex logic
- Write meaningful commit messages
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [TipTap](https://tiptap.dev/) - Rich text editor
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [MongoDB](https://www.mongodb.com/) - Database
- [Vercel](https://vercel.com/) - Hosting platform

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

<div align="center">

  **Built with ❤️ using TypeScript, Next.js, and Node.js**

  By [Anurag Dahal](https://github.com/yourusername)

  <img src="https://avatars.githubusercontent.com/u/182152497?s=200&v=4" alt="Codixra Labs Logo" width="30"/>

  **[Codixra Labs](https://github.com/codixra)**

  ---

  [Report Bug](https://github.com/yourusername/blog-cms/issues) · [Request Feature](https://github.com/yourusername/blog-cms/issues)

</div>
