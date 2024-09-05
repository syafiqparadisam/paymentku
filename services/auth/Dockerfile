# Base image
FROM node:18.17.1-alpine AS builder

# Create app directory
WORKDIR /app    

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

COPY . .

RUN npm run build

# for build
FROM node:18.17.1-alpine

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/src/dataSource /app/src/dataSource
COPY --from=builder /app/src/migration /app/src/migration
COPY --from=builder /app/src/users/schemas /app/src/users/schemas
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json
COPY --from=builder /app/tsconfig.build.json  /app/tsconfig.build.json
COPY --from=builder /app/tsconfig.json /app/tsconfig.json
COPY --from=builder /app/nest-cli.json /app/nest-cli.json


RUN npm install

# Start the server using the production build
CMD ["npm", "run", "migrate-run", "&&", "node", "dist/main.js"]