
FROM node:21-alpine AS build

# Create app directory
WORKDIR /app    

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

COPY . .

RUN npm run build

# Use a new image for the runner stage
FROM node:21-alpine AS runner

# Set the working directory
WORKDIR /app

# Copy the dependencies and build output from the build stage
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

# Create a non-root user and group for running the app
RUN addgroup -S runner && adduser -S runner -G runner

ENV NODE_ENV=production

# Change the ownership of the files to the 'runner' user
RUN chown -R runner:runner /app

# Switch to the non-root user
USER runner

# Start the server using the production build
CMD ["node", "dist/main.js"]
