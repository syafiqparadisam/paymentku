# Step 1: Build Stage
FROM node:21-alpine AS build

# Set the working directory for the build stage
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the application files to the container
COPY . .

# Build the application
RUN npm run build

# Step 2: Production Stage with Nginx
FROM nginx:alpine

# Set the working directory for the NGINX stage
WORKDIR /app

# Copy the built app from the build stage to the NGINX web root
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom NGINX configuration
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to allow access to the app
EXPOSE 80

# Define a healthcheck to monitor the container's health
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl --fail http://localhost:80/ || exit 1

# Start the NGINX server
CMD ["nginx", "-g", "daemon off;"]
