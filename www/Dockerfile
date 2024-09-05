FROM node:18.17.1-alpine AS build

# Set the working directory
WORKDIR /app

# Copy source code
COPY . .

# Install the dependencies
RUN npm install

RUN npm run build

# use nginx to put build website
FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Run the app
CMD [ "nginx", "-g", "daemon off;" ]