# Step 1: Build Stage
FROM node:22-alpine AS build

# Set the working directory for the build stage
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the application files to the container
COPY . .


ENV VITE_API_URL="MY_APP_API_URL"
ENV VITE_FRONTEND_URL="MY_APP_FRONTEND_URL"
ENV VITE_SERVICE_ID_EMAILJS="MY_APP_SERVICE_ID_EMAILJS"
ENV VITE_TEMPLATE_ID_HELPING_EMAILJS="MY_APP_TEMPLATE_ID_HELPING_EMAILJS"
ENV VITE_PUBLIC_KEY_EMAILJS="MY_APP_PUBLIC_KEY_EMAILJS" 

RUN npm run build

FROM nginx:alpine


# Build the application 
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom NGINX configuration
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY ./env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

# Expose port 80 to allow access to the app
EXPOSE 80

# Define a healthcheck to monitor the container's health
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl --fail http://localhost:80/ || exit 1

# Start the NGINX server
CMD ["nginx", "-g", "daemon off;"]
