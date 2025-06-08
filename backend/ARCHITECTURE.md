# Backend Architecture - Features Directory Approach

This backend follows a **features-based architecture** where each feature is self-contained with its own controllers, services, routes, and schemas.

## Directory Structure

```
src/
├── features/              # Feature-based modules
│   ├── auth/             # Authentication feature
│   │   ├── controllers/  # Auth controllers
│   │   ├── services/     # Auth-specific services & DB queries
│   │   ├── routes/       # Auth routes
│   │   ├── schemas/      # Zod validation schemas for auth
│   │   └── index.ts      # Feature exports
│   ├── posts/            # Posts feature
│   │   ├── controllers/  # Post controllers
│   │   ├── services/     # Post-specific services & DB queries
│   │   ├── routes/       # Post routes
│   │   ├── schemas/      # Zod validation schemas for posts
│   │   └── index.ts      # Feature exports
│   ├── comments/         # Comments feature
│   │   ├── controllers/  # Comment controllers
│   │   ├── services/     # Comment-specific services & DB queries
│   │   ├── routes/       # Comment routes
│   │   ├── schemas/      # Zod validation schemas for comments
│   │   └── index.ts      # Feature exports
│   └── index.ts          # All features export
├── shared/               # Shared utilities and services
│   ├── services/         # Global services (response, etc.)
│   └── index.ts          # Shared exports
├── middlewares/          # Global middlewares
├── helpers/              # Global helper functions
├── models/               # Mongoose models
├── types/                # TypeScript type definitions
├── constants/            # Application constants
├── config/               # Configuration files
├── db/                   # Database connection
└── index.ts              # Application entry point
```

## Features Architecture

### Each Feature Contains:

1. **Controllers**: Handle HTTP requests and responses
2. **Services**: Business logic and database queries
3. **Routes**: Express route definitions with middleware
4. **Schemas**: Zod validation schemas
5. **Index**: Exports all feature components

### Benefits:

- **Modular**: Each feature is self-contained
- **Scalable**: Easy to add new features
- **Maintainable**: Related code is grouped together
- **Testable**: Easy to test individual features
- **Reusable**: Features can be easily moved or extracted

## Usage Examples

### Importing from Features:
```typescript
import { authRoutes, userSignup, signupSchema } from '@/features/auth';
import { postsRoutes, addNewPost, postSchema } from '@/features/posts';
import { commentsRoutes, createComment } from '@/features/comments';
```

### Adding a New Feature:
1. Create new directory in `features/`
2. Add `controllers/`, `services/`, `routes/`, `schemas/` subdirectories
3. Implement your feature components
4. Create `index.ts` to export components
5. Add feature export to main `features/index.ts`

## Global vs Feature-Specific

- **Global**: Middlewares, helpers, models, types, constants, config
- **Feature-Specific**: Controllers, services, routes, schemas related to that feature

This architecture promotes separation of concerns while maintaining clean imports and exports.
