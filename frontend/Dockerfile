# Build stage
FROM --platform=$BUILDPLATFORM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json ./
COPY package-lock.json ./

# Install dependencies with specific version lock
RUN npm ci --legacy-peer-deps --prefer-offline

# Copy the rest of the app's code
COPY . .

# Build the app
RUN npm run build

# Run stage
FROM --platform=$TARGETPLATFORM nginx:alpine

# Copy nginx configuration
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 3000

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
