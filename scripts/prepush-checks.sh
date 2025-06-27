#!/bin/sh

# Exit on error
set -e

# Lint client and backend
cd client && pnpm lint && cd ..
echo "Client lint passed!"
cd backend && pnpm lint && cd ..
echo "Backend lint passed!"

# Type check client and backend
cd client && pnpm tsc --noEmit && cd ..
echo "Client type check passed!"
cd backend && pnpm tsc --noEmit && cd ..
echo "Backend type check passed!"

# Run tests (if any)
# cd client && pnpm test && cd ..
# echo "Client tests passed!"
# cd backend && pnpm test && cd ..
# echo "Backend tests passed!"

# Build client
cd client && pnpm build && cd ..
echo "Client build passed!"

# Security audit (optional, uncomment if needed)
cd backend && pnpm audit --audit-level=high && cd ..
echo "Backend security audit passed!"

cd client && pnpm audit --audit-level=high && cd ..
echo "Client security audit passed!"

# Format code
cd client && pnpm format && cd ..
cd backend && pnpm format && cd ..
echo "Code formatting passed!"

echo "All pre-push checks passed!"
