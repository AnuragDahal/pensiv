<div align="center">
  <img src="client/public/logo.png" alt="Pensiv Logo" width="200"/>

  # Pensiv

  ### A Modern, Full-Stack Blogging Platform

  *Share your thoughts, build your audience, and manage content with ease*

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/AnuragDahal/pensiv/releases)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)

</div>

---

## 📑 Table of Contents

- [About](#-about)
- [Open Source](#-open-source)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Development Scripts](#️-development-scripts)
- [Security Features](#-security-features)
- [Contributing](#-contributing)
- [Documentation](#-documentation)
- [License](#-license)
- [Support](#-community--support)

---

## 📖 About

**Pensiv** is a production-ready, full-stack content management system designed for modern bloggers, writers, and content creators. Built with a focus on performance, scalability, and developer experience, Pensiv provides everything you need to create, manage, and share compelling content.

The platform features a beautiful, responsive interface with a powerful rich-text editor, real-time engagement metrics, and comprehensive content management tools. Whether you're building a personal blog, a team publication, or a content-driven business, Pensiv scales to meet your needs.

## 🌟 Open Source

**Pensiv is free and open source software** released under the [MIT License](LICENSE). This means you can:

- ✅ Use it for personal or commercial projects
- ✅ Modify and customize it to your needs
- ✅ Distribute and sell your modifications
- ✅ Use it in proprietary software

We believe in the power of open source and community collaboration. Contributions, bug reports, and feature requests are welcome! See our [Contributing Guidelines](#-contributing) to get started.

**Star ⭐ this repository if you find it useful!**

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
- **Code Syntax Highlighting** - Beautiful code blocks with highlight.js
- **Search & Filtering** - fuzzy search across titles, content, tags, and authors

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

- **Node.js** v20.x or higher
- **pnpm** v10.x or higher (recommended)
- **MongoDB** v8.x or higher (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Git** for cloning the repository

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/AnuragDahal/pensiv.git
cd pensiv

# Install backend dependencies
cd backend
pnpm install

# Install frontend dependencies
cd ../client
pnpm install
```

### 2. Configure Environment

Create `.env` files in both backend and client directories:

**Backend (`backend/.env`):**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name

# JWT Secrets (Generate strong random strings)
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Frontend (`client/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SUPABASE_URL=your-supa-base-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> **📖 Detailed Setup Instructions**: See [INSTALLATION.md](INSTALLATION.md) for complete environment configuration, MongoDB setup, and troubleshooting.

### 3. Run the Application

**Backend** (Terminal 1):
```bash
cd backend
pnpm dev
```

**Frontend** (Terminal 2):
```bash
cd client
pnpm dev
```

Visit `http://localhost:3000` to see your application running!

### Using Docker

```bash
docker-compose up -d
```

This starts MongoDB, backend, and frontend in containers.

## 📚 API Documentation

### Quick Start

Import the Postman collection from `backend/postman_collection.json` for complete API testing:

```bash
1. Open Postman
2. Import `backend/postman_collection.json`
3. Import environment files from `backend/` directory
```

### Key Endpoints

- **Authentication**: `/api/auth/*` - Signup, Login, Profile management
- **Posts**: `/api/posts/*` - CRUD operations, likes, search
- **Comments**: `/api/comments/*` - Create, update, delete, replies, likes

> **📖 Complete API Reference**: See [backend/POSTMAN_GUIDE.md](backend/POSTMAN_GUIDE.md) for detailed endpoint documentation

## 📁 Project Structure

```
pensiv/
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

### Vercel (Recommended)

Optimized for serverless deployment:

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy automatically on push

**Configuration files**: `backend/vercel.json`, `client/next.config.js`

### Docker

```bash
docker-compose up -d      # Start all services
docker-compose logs -f    # View logs
docker-compose down       # Stop services
```

> **📖 Detailed Deployment Guide**: See [INSTALLATION.md](INSTALLATION.md#docker-installation) for Docker setup and troubleshooting

## 🛠️ Development Scripts

### Backend
```bash
pnpm dev          # Start development server with nodemon
pnpm build        # Build TypeScript to dist/
pnpm prod         # Run production build
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
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

We welcome contributions from the community! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Quick Guidelines

- Use TypeScript with strict mode
- Follow ESLint/Prettier configurations
- Write meaningful commit messages ([Conventional Commits](https://www.conventionalcommits.org/))
- Test your changes thoroughly

> **📖 Full Contributing Guide**: See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines, code standards, and development workflow

## 📖 Documentation

- **[Installation Guide](INSTALLATION.md)** - Complete setup instructions, environment configuration, and troubleshooting
- **[Contributing Guidelines](CONTRIBUTING.md)** - How to contribute, code standards, and PR process
- **[API Documentation](backend/POSTMAN_GUIDE.md)** - Complete API reference and Postman guide
- **[Security Policy](SECURITY.md)** - Security best practices and vulnerability reporting
- **[Changelog](CHANGELOG.md)** - Version history and release notes

## 📄 License

**Pensiv is open source software** licensed under the [MIT License](LICENSE).

This means you are free to use, modify, and distribute this software for any purpose, including commercial use. See the [LICENSE](LICENSE) file for the full license text.

## 🙏 Acknowledgments

Built with these amazing technologies:

- [Next.js](https://nextjs.org/) - React framework for production
- [TipTap](https://tiptap.dev/) - Headless rich text editor
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible UI primitives
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Vercel](https://vercel.com/) - Deployment and hosting platform

## 💬 Community & Support

- **Issues**: [Report bugs or request features](https://github.com/AnuragDahal/pensiv/issues)
- **Discussions**: [Ask questions and share ideas](https://github.com/AnuragDahal/pensiv/discussions)
- **Pull Requests**: [Contribute to the project](https://github.com/AnuragDahal/pensiv/pulls)

For support, open an issue on GitHub or start a discussion in the community forum.

---

<div align="center">

  **Built with ❤️ using TypeScript, Next.js, and Node.js**

  Created by [Anurag Dahal](https://github.com/AnuragDahal)

  <img src="https://avatars.githubusercontent.com/u/182152497?s=200&v=4" alt="Codixra Labs Logo" width="30"/>

  **[Codixra Labs](https://github.com/codixra)**

  ---

  **[⭐ Star on GitHub](https://github.com/AnuragDahal/pensiv)** · **[🐛 Report Bug](https://github.com/AnuragDahal/pensiv/issues)** · **[✨ Request Feature](https://github.com/AnuragDahal/pensiv/issues)**

  ---

  ### Release v1.0.0

  *First stable release - January 2026*

</div>