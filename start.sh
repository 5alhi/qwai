#!/bin/sh
set -e

echo "🔄 Running database migrations..."
pnpm db:push

echo "✅ Migrations complete. Starting server..."
exec node dist/index.js
