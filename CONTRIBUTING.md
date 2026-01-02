# Contributing to Pensiv

Thank you for your interest in contributing to Pensiv! We welcome contributions from the community and are grateful for your support.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone. Be kind, professional, and constructive in all interactions.

## Getting Started

1. **Fork the Repository**
   ```bash
   # Fork via GitHub UI, then clone your fork
   git clone https://github.com/YOUR_USERNAME/pensiv.git
   cd pensiv
   ```

2. **Set Up Development Environment**

   Follow the detailed instructions in [INSTALLATION.md](INSTALLATION.md) to set up your local development environment.

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

   Branch naming conventions:
   - `feature/` - New features
   - `fix/` - Bug fixes
   - `docs/` - Documentation updates
   - `refactor/` - Code refactoring
   - `test/` - Adding or updating tests

## Development Workflow

### Backend Development

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. The server will run on `http://localhost:5000` with hot reload enabled.

### Frontend Development

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. The app will run on `http://localhost:3000` with Turbopack for fast refresh.

### Running Tests

```bash
# Backend tests
cd backend
pnpm test

# Frontend tests
cd client
pnpm test
```

## Coding Standards

### TypeScript

- **Strict Mode**: Always use TypeScript strict mode
- **Type Safety**: Avoid using `any` - use proper types or `unknown`
- **Interfaces vs Types**: Prefer `interface` for object shapes, `type` for unions/intersections
- **Null Safety**: Handle null/undefined cases explicitly

### Code Style

- **ESLint**: Follow the project's ESLint configuration
- **Prettier**: Format code with Prettier before committing
  ```bash
  pnpm format
  ```
- **Naming Conventions**:
  - Components: `PascalCase` (e.g., `ArticleCard.tsx`)
  - Functions: `camelCase` (e.g., `getUserData`)
  - Constants: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)
  - Files: `kebab-case` for utilities, `PascalCase` for components

### Project Structure

- **Backend**: Feature-based modules in `src/features/`
- **Frontend**: Co-locate related components, hooks, and utilities
- **Shared**: Use `src/shared/` for utilities used across features

### Best Practices

1. **Keep Functions Small**: Each function should do one thing well
2. **Meaningful Names**: Use descriptive variable and function names
3. **Comments**: Add comments for complex logic, not obvious code
4. **Error Handling**: Always handle errors gracefully with proper user feedback
5. **Security**: Validate all user inputs, sanitize outputs, use environment variables for secrets
6. **Performance**: Optimize images, lazy load components, memoize expensive calculations
7. **Accessibility**: Use semantic HTML, ARIA labels, keyboard navigation support

## Submitting Changes

### Pull Request Process

1. **Update Your Branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run Quality Checks**
   ```bash
   # Lint your code
   pnpm lint

   # Format your code
   pnpm format

   # Run tests
   pnpm test
   ```

3. **Commit Your Changes**

   Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

   ```bash
   git commit -m "feat: add user profile editing"
   git commit -m "fix: resolve authentication token expiry issue"
   git commit -m "docs: update API documentation"
   git commit -m "refactor: simplify article fetching logic"
   ```

   Commit message format:
   ```
   <type>: <subject>

   [optional body]

   [optional footer]
   ```

   Types:
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation changes
   - `style`: Code style changes (formatting, etc.)
   - `refactor`: Code refactoring
   - `test`: Adding or updating tests
   - `chore`: Maintenance tasks

4. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**

   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill out the PR template with:
     - Clear description of changes
     - Related issue numbers (if applicable)
     - Screenshots (for UI changes)
     - Testing steps

   PR Title Format:
   ```
   feat: Add user profile editing functionality
   fix: Resolve authentication token refresh bug
   docs: Update installation guide
   ```

### PR Review Process

- Maintainers will review your PR within 3-5 business days
- Address review comments and push updates
- Once approved, a maintainer will merge your PR
- Your contribution will be included in the next release

## Reporting Bugs

Found a bug? Help us fix it!

1. **Check Existing Issues**: Search [GitHub Issues](https://github.com/AnuragDahal/pensiv/issues) to avoid duplicates

2. **Create a New Issue** with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots or error messages
   - Environment details (OS, browser, Node.js version)

**Bug Report Template:**
```markdown
## Bug Description
[Clear description of the bug]

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Screenshots
[If applicable]

## Environment
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node.js: [e.g., v20.10.0]
- Version: [e.g., v1.0.0]
```

## Requesting Features

Have an idea for a new feature?

1. **Check Existing Requests**: Review [GitHub Issues](https://github.com/AnuragDahal/pensiv/issues?q=is%3Aissue+label%3Aenhancement)

2. **Create a Feature Request** with:
   - Clear, descriptive title
   - Problem it solves
   - Proposed solution
   - Alternative solutions considered
   - Additional context

**Feature Request Template:**
```markdown
## Feature Description
[Clear description of the feature]

## Problem Statement
[What problem does this solve?]

## Proposed Solution
[How should this work?]

## Alternatives Considered
[Other approaches you've thought about]

## Additional Context
[Mockups, examples, or references]
```

## Questions?

If you have questions about contributing:
- Open a [GitHub Discussion](https://github.com/AnuragDahal/pensiv/discussions)
- Comment on relevant issues
- Reach out to maintainers

---

Thank you for contributing to Pensiv! Your efforts help make this project better for everyone.
