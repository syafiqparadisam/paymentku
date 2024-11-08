# Base image
<<<<<<< HEAD
FROM node:18.17.1-alpine AS builder
=======
FROM node:21-alpine AS build
>>>>>>> master

# Create app directory
WORKDIR /app    

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

COPY . .

<<<<<<< HEAD
# Use Docker secrets with required=true and mode=0666, then set environment variables
RUN --mount=type=secret,id=CLIENT_ID,required=true,mode=0666 \
    --mount=type=secret,id=CLIENT_SECRET,required=true,mode=0666 \
    --mount=type=secret,id=CALLBACK_URL_GOOGLE,required=true,mode=0666 \
    --mount=type=secret,id=FRONTEND,required=true,mode=0666 \
    --mount=type=secret,id=SMTP_KEY,required=true,mode=0666 \
    --mount=type=secret,id=SMTP_LOGIN,required=true,mode=0666 \
    --mount=type=secret,id=AUTH_SVC,required=true,mode=0666 \
    --mount=type=secret,id=USER_ICON_DEFAULT,required=true,mode=0666 \
    --mount=type=secret,id=USER_SVC,required=true,mode=0666 \
    --mount=type=secret,id=TF_SVC,required=true,mode=0666 \
    --mount=type=secret,id=HISTORY_SVC,required=true,mode=0666 \
    --mount=type=secret,id=NEST_APP_PORT,required=true,mode=0666 \
    --mount=type=secret,id=REDIS_HOST,required=true,mode=0666 \
    --mount=type=secret,id=DB_PORT,required=true,mode=0666 \
    --mount=type=secret,id=DB_HOST,required=true,mode=0666 \
    --mount=type=secret,id=DB_USER,required=true,mode=0666 \
    --mount=type=secret,id=DB_PASSWD,required=true,mode=0666 \
    --mount=type=secret,id=DB_NAME,required=true,mode=0666 \
    --mount=type=secret,id=REDIS_PORT,required=true,mode=0666 \
    --mount=type=secret,id=CLOUDINARY_APISECRET,required=true,mode=0666 \
    --mount=type=secret,id=CLOUDINARY_CLOUDNAME,required=true,mode=0666 \
    --mount=type=secret,id=CLOUDINARY_APIKEY,required=true,mode=0666 \
    CLIENT_ID=$(cat /run/secrets/CLIENT_ID) \
    CLIENT_SECRET=$(cat /run/secrets/CLIENT_SECRET) \
    CALLBACK_URL_GOOGLE=$(cat /run/secrets/CALLBACK_URL_GOOGLE) \
    FRONTEND=$(cat /run/secrets/FRONTEND) \
    SMTP_KEY=$(cat /run/secrets/SMTP_KEY) \
    SMTP_LOGIN=$(cat /run/secrets/SMTP_LOGIN) \
    AUTH_SVC=$(cat /run/secrets/AUTH_SVC) \
    USER_ICON_DEFAULT=$(cat /run/secrets/USER_ICON_DEFAULT) \
    USER_SVC=$(cat /run/secrets/USER_SVC) \
    TF_SVC=$(cat /run/secrets/TF_SVC) \
    HISTORY_SVC=$(cat /run/secrets/HISTORY_SVC) \
    NEST_APP_PORT=$(cat /run/secrets/NEST_APP_PORT) \
    REDIS_HOST=$(cat /run/secrets/REDIS_HOST) \
    DB_PORT=$(cat /run/secrets/DB_PORT) \
    DB_HOST=$(cat /run/secrets/DB_HOST) \
    DB_USER=$(cat /run/secrets/DB_USER) \
    DB_PASSWD=$(cat /run/secrets/DB_PASSWD) \
    DB_NAME=$(cat /run/secrets/DB_NAME) \
    REDIS_PORT=$(cat /run/secrets/REDIS_PORT) \
    CLOUDINARY_APISECRET=$(cat /run/secrets/CLOUDINARY_APISECRET) \
    CLOUDINARY_CLOUDNAME=$(cat /run/secrets/CLOUDINARY_CLOUDNAME) \
    CLOUDINARY_APIKEY=$(cat /run/secrets/CLOUDINARY_APIKEY) \
    npm run build

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
=======
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
>>>>>>> master
