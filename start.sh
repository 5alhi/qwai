#!/bin/sh
set -e

echo "🔄 Running database migrations..."
pnpm db:push

echo "🌱 Seeding default articles (skips existing)..."
npx tsx scripts/seed-articles.mts

echo "✅ Setup complete. Starting server..."
exec node dist/index.js
