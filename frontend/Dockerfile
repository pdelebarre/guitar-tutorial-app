# Stage 1: Build the Vite app
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app’s code
COPY . .

# Build the app for production
RUN npm run build

# Stage 2: Serve the app with NGINX
FROM nginx:alpine

# Copy the built files from the previous stage to the NGINX web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the port NGINX is running on
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
