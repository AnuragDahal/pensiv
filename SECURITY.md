# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously at Pensiv. If you discover a security vulnerability, please follow these steps:

### 🔒 Please Do NOT

- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly before it has been addressed
- Exploit the vulnerability beyond what is necessary to demonstrate it

### ✅ Please Do

1. **Email us directly** at the project maintainer's email (or use GitHub Security Advisories)
2. **Include the following information**:
   - Type of vulnerability (e.g., XSS, SQL injection, authentication bypass)
   - Full paths of affected source file(s)
   - Location of the affected code (tag/branch/commit or direct URL)
   - Step-by-step instructions to reproduce the issue
   - Proof-of-concept or exploit code (if possible)
   - Impact of the issue, including how an attacker might exploit it

3. **Allow us time to respond**:
   - We will acknowledge your email within 48 hours
   - We will send a more detailed response within 7 days
   - We will work on a fix and keep you updated on progress
   - We will coordinate the disclosure timeline with you

## Security Best Practices

When deploying Pensiv, please follow these security best practices:

### Environment Variables

- **Never commit `.env` files** to version control
- Use **strong, randomly generated secrets** for `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`
- Generate secrets using: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- Rotate secrets periodically, especially after team member departures

### Database Security

- Use **MongoDB Atlas** with IP whitelisting for production
- Enable **MongoDB authentication** with strong passwords
- Use **connection string encryption** in environment variables
- Regularly backup your database

### Application Security

- **Keep dependencies updated**: Run `pnpm audit` regularly
- **Use HTTPS in production**: Never serve the app over HTTP
- **Enable CORS** only for trusted domains
- **Validate all user inputs** on both client and server
- **Sanitize HTML** content before rendering
- **Use parameterized queries** to prevent injection attacks

### Deployment Security

- **Set `NODE_ENV=production`** in production environments
- **Disable development tools** in production builds
- **Use environment-specific configurations**
- **Enable rate limiting** for API endpoints
- **Implement request validation** and sanitization
- **Use security headers** (CSP, X-Frame-Options, etc.)

### Authentication & Authorization

- **Use secure password hashing** (bcrypt with sufficient rounds)
- **Implement JWT expiration** and refresh token rotation
- **Validate tokens** on every protected route
- **Use httpOnly cookies** for sensitive tokens when applicable
- **Implement account lockout** after failed login attempts

## Security Features

Pensiv includes several built-in security features:

- ✅ JWT-based authentication with refresh tokens
- ✅ Password hashing with bcryptjs
- ✅ Input validation using Zod schemas
- ✅ CORS protection
- ✅ Mongoose ODM for SQL injection prevention
- ✅ Environment variable validation
- ✅ Secure HTTP headers

## Known Security Considerations

### Content Security

- **User-generated content**: All user-generated HTML is sanitized before rendering
- **File uploads**: Images are validated and processed through secure storage (Supabase)
- **XSS protection**: Content is escaped and validated

### API Security

- **Rate limiting**: Consider implementing rate limiting for production
- **API authentication**: All sensitive endpoints require valid JWT tokens
- **Input validation**: All API inputs are validated with Zod schemas

## Security Updates

We will post security updates and advisories in:

- [GitHub Security Advisories](https://github.com/AnuragDahal/pensiv/security/advisories)
- [Releases page](https://github.com/AnuragDahal/pensiv/releases)
- [CHANGELOG.md](CHANGELOG.md)

## Disclosure Policy

- Security issues are typically fixed within 7-30 days depending on severity
- We follow coordinated vulnerability disclosure
- We will credit researchers who responsibly disclose vulnerabilities (unless they prefer to remain anonymous)

## Contact

For security concerns, please contact:

- **GitHub Security Advisory**: [Create a private security advisory](https://github.com/AnuragDahal/pensiv/security/advisories/new)
- **Issue Tracker** (for non-security bugs): [GitHub Issues](https://github.com/AnuragDahal/pensiv/issues)

---

Thank you for helping keep Pensiv and our users safe!
