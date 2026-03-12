# Single-stage build: install all deps (including devDeps needed at runtime by esbuild --packages=external)
FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files AND patches (pnpm needs patches during install)
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/

# Install ALL dependencies (devDeps are needed at runtime because esbuild uses --packages=external)
RUN pnpm install --frozen-lockfile

# Copy all source files
COPY . .

# Build the application (vite build + esbuild server bundle)
RUN pnpm run build

# Expose port
EXPOSE 3000

# Start the application in production mode
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
