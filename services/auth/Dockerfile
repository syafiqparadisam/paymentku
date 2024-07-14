# Base image
FROM node:18.17.1-alpine

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

COPY . .

# Start the server using the production build
CMD npm run migrate-run && npm run build && npm run start:prod