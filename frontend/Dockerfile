# Stage 1: Build the Vite app
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app
# COPY .env .env

# Define build args
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ARG VITE_API_BASE_PORT
ENV VITE_API_BASE_PORT=${VITE_API_BASE_PORT}


# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the app’s code
COPY . .

# Build the app for production
RUN npm run build

# Stage 2: Serve the app with NGINX
FROM nginx:alpine

# Copy the built files from the previous stage to the NGINX web root
COPY --from=builder /app/dist /usr/share/nginx/html

#shell to be able to catch variables at docker run time
#https://dev.to/sanjayttg/dynamic-environment-variables-for-dockerized-react-apps-5bc5
# COPY env.sh /docker-entrypoint.d/env.sh
# RUN chmod +x /docker-entrypoint.d/env.sh


# Expose the port NGINX is running on
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
