FROM node:18.17.1-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the app files
COPY . .

# Build the app
RUN npm run build

# Run the app
CMD ["npm", "run", "preview"]