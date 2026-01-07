# Token Blacklisting System

## Overview

This document describes the token blacklisting (revocation) system implemented in the blog CMS application. The system ensures that tokens cannot be reused after logout or refresh, providing enhanced security.

## Features

### 1. **Blocked Token Collection**
- A MongoDB collection named `blockedtokens` stores all blacklisted tokens
- Each entry includes:
  - `token`: The actual JWT token string
  - `tokenType`: Either "access" or "refresh"
  - `userId`: Reference to the user who owned the token
  - `expiresAt`: When the token expires (for automatic cleanup)
  - `createdAt`: When the token was blacklisted

### 2. **Automatic Cleanup**
- MongoDB TTL (Time-To-Live) index automatically removes expired tokens
- No manual cleanup required
- Keeps the database lean and performant

### 3. **Token Blacklisting on Logout**
When a user logs out:
1. The access token from the Authorization header is extracted
2. The refresh token is retrieved from the user's database record
3. Both tokens are added to the blocklist
4. The refresh token is removed from the user record
5. Cookies are cleared

### 4. **Token Blacklisting on Refresh**
When a user refreshes their access token:
1. The old refresh token is validated
2. New access and refresh tokens are generated
3. The old refresh token is added to the blocklist
4. This prevents refresh token reuse attacks

### 5. **Middleware Protection**
The `isAuthenticated` middleware now:
1. Extracts the token from the Authorization header
2. Checks if the token is blacklisted
3. If blacklisted, returns a 401 error with message "Token has been blacklisted. Please login again."
4. If not blacklisted, proceeds with normal JWT verification

## Implementation Details

### Files Created/Modified

#### New Files:
1. **`backend/src/features/auth/models/blocked-token.model.ts`**
   - Mongoose model for the BlockedToken collection
   - Includes TTL index for automatic cleanup

2. **`backend/src/features/auth/services/blocked-token.service.ts`**
   - Service layer for blocked token operations
   - Functions:
     - `addTokenToBlocklist()`: Add a token to the blocklist
     - `isTokenBlacklisted()`: Check if a token is blacklisted
     - `cleanupExpiredTokens()`: Manual cleanup (optional)
     - `getUserBlockedTokens()`: Get all blocked tokens for a user
     - `removeUserBlockedTokens()`: Remove all blocked tokens for a user

#### Modified Files:
1. **`backend/src/middlewares/authentication.ts`**
   - Added blacklist check before token verification
   - Changed `isAuthenticated` to async function

2. **`backend/src/features/auth/controllers/auth.controller.ts`**
   - Updated `userLogout` to blacklist both tokens
   - Updated `accessTokenRefresh` to blacklist old refresh token

## Usage Examples

### Logout Flow
```typescript
// Client sends logout request with Authorization header
POST /api/auth/logout
Headers: {
  Authorization: "Bearer <access_token>"
}

// Server:
// 1. Extracts access token from header
// 2. Gets refresh token from user record
// 3. Adds both to blocklist
// 4. Removes refresh token from user
// 5. Clears cookies
// 6. Returns success response
```

### Token Refresh Flow
```typescript
// Client sends refresh request
POST /api/auth/refresh
Body: {
  refreshToken: "<refresh_token>"
}

// Server:
// 1. Checks if refresh token is blacklisted
// 2. If blacklisted, returns 403 error
// 3. If valid, generates new tokens
// 4. Blacklists old refresh token
// 5. Returns new tokens
```

### Protected Route Access
```typescript
// Client sends request to protected route
GET /api/auth/me
Headers: {
  Authorization: "Bearer <access_token>"
}

// Middleware:
// 1. Extracts token from header
// 2. Checks if token is blacklisted
// 3. If blacklisted, returns 401 error
// 4. If not blacklisted, verifies JWT
// 5. Proceeds to route handler
```

## Security Benefits

1. **Prevents Token Reuse**: Logged out tokens cannot be used again
2. **Prevents Refresh Token Reuse**: Old refresh tokens are invalidated when new ones are issued
3. **Automatic Cleanup**: Expired tokens are automatically removed from the database
4. **Defense Against Token Theft**: Stolen tokens become useless after logout
5. **Session Management**: Users can effectively end their sessions

## Performance Considerations

1. **Database Query**: Each protected request now includes a database lookup to check the blocklist
2. **Indexing**: The `token` field is indexed for fast lookups
3. **TTL Index**: Automatic cleanup prevents database bloat
4. **Caching**: Consider implementing Redis caching for frequently checked tokens in production

## Future Enhancements

1. **Redis Integration**: Use Redis for faster blacklist checks
2. **Logout All Devices**: Add endpoint to blacklist all tokens for a user
3. **Admin Dashboard**: View and manage blacklisted tokens
4. **Token Rotation**: Implement automatic token rotation
5. **Suspicious Activity Detection**: Flag and blacklist tokens on suspicious activity

## Testing

### Test Scenarios

1. **Normal Logout**
   - Login → Logout → Try to use old token → Should fail with "Token has been blacklisted"

2. **Token Refresh**
   - Login → Refresh token → Try to use old refresh token → Should fail

3. **Multiple Devices**
   - Login on Device A → Login on Device B → Logout on Device A → Device B should still work

4. **Expired Tokens**
   - Wait for token expiry → Check if token is automatically removed from blocklist

## Troubleshooting

### Common Issues

1. **"Token has been blacklisted" on valid requests**
   - Check if logout was called accidentally
   - Verify token is being sent correctly
   - Check database for unexpected entries

2. **Tokens not being blacklisted**
   - Check if `addTokenToBlocklist` is being called
   - Verify MongoDB connection
   - Check for errors in console logs

3. **Performance issues**
   - Verify indexes are created
   - Consider implementing Redis caching
   - Check database query performance

## API Responses

### Blacklisted Token Response
```json
{
  "status": 401,
  "message": "Token has been blacklisted. Please login again.",
  "error": "TokenBlacklisted"
}
```

### Successful Logout Response
```json
{
  "status": 200,
  "message": "Logged out successfully",
  "data": {}
}
```

## Database Schema

```typescript
{
  token: String,          // The JWT token (indexed)
  tokenType: "access" | "refresh",
  userId: ObjectId,       // Reference to User (indexed)
  expiresAt: Date,        // Token expiry (indexed with TTL)
  createdAt: Date,        // When blacklisted
  updatedAt: Date
}
```

## Environment Variables

No additional environment variables are required. The system uses existing JWT secrets:
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`

## Deployment Notes

1. **MongoDB Indexes**: Ensure indexes are created in production
2. **TTL Index**: Verify TTL index is working (check MongoDB logs)
3. **Monitoring**: Monitor database size and query performance
4. **Logging**: Enable logging for blacklist operations in production

## Conclusion

The token blacklisting system provides a robust solution for token revocation, enhancing the security of the authentication system. It prevents token reuse after logout and refresh, while maintaining good performance through proper indexing and automatic cleanup.
