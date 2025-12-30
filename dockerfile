# Step 1: Build the Vite React app
FROM node:18 AS builder

WORKDIR /app

# Copy project files
COPY package*.json ./
COPY vite.config.ts ./
COPY tsconfig*.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY .env .env 

# Copy the rest of the source
COPY . .

# Install dependencies and build
RUN npm install
RUN npm run build

# Step 2: Serve with NGINX
FROM nginx:stable-alpine

# Clean the default html directory
RUN rm -rf /usr/share/nginx/html/*

# Copy build output from previous step
COPY --from=builder /app/dist /usr/share/nginx/html

# 🔐 Do NOT copy the .env file to NGINX container
# This makes sure .env is only used at build time, not served

# Expose port 80
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
