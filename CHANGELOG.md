# Changelog

All notable changes to Pensiv will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-02

### 🎉 Initial Release

First stable release of Pensiv - A modern, full-stack blogging platform.

### ✨ Features

#### Content Management
- Rich text editor powered by TipTap with code highlighting, image embedding, and link support
- Draft and publish system with version control
- Category and tag-based content organization
- Cover image support with Unsplash(seeding cover image) and Supabase Intergration

#### User Features
- JWT-based authentication with refresh tokens
- Customizable user profiles with bio, avatar, and social links
- Engagement system (likes, comments, and replies)
- Reading analytics and view tracking
- Featured posts based on engagement metrics
- Smart article recommendations based on tags and authors

#### Technical Features
- Server-side rendering with Next.js 16
- RESTful API with comprehensive documentation
- Real-time updates for reactions and comments
- Responsive, mobile-first design
- Code syntax highlighting with highlight.js
- Full-text search across titles, content, tags, and authors

#### Developer Experience
- Full TypeScript support across frontend and backend
- Modular architecture with clean separation of concerns
- Comprehensive API documentation with Postman collection
- Docker support for containerized deployment
- Vercel-optimized serverless deployment
- Runtime environment validation with Zod
- ESLint and Prettier configurations

### 🛠️ Tech Stack

**Frontend:**
- Next.js 16 (React 19)
- TypeScript
- Tailwind CSS
- Radix UI
- Shadcn UI
- Supabase
- TipTap
- Zustand
- Zod
- React Hook Form

**Backend:**
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT authentication
- Zod validation

**DevOps:**
- Docker & Docker Compose
- Vercel deployment
- pnpm package manager

### 📦 Deployment

- Vercel serverless deployment configuration
- Docker Compose setup for local development
- MongoDB Atlas integration
- Environment variable validation

### 📚 Documentation

- Comprehensive README with setup instructions
- API documentation with Postman collection
- Environment configuration guide
- Deployment guides for Vercel and Docker

### 🔒 Security

- JWT access and refresh tokens
- Password hashing with bcryptjs
- Input validation with Zod schemas
- CORS protection
- XSS prevention
- SQL injection prevention via Mongoose ODM

---

## Future Releases

For upcoming features and improvements, see our [GitHub Issues](https://github.com/AnuragDahal/pensiv/issues).

[1.0.0]: https://github.com/AnuragDahal/pensiv/releases/tag/v1.0.0
