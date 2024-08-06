# Base image
FROM node:18.17.1-alpine AS builder

# Create app directory
WORKDIR /usr/src/app    

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

COPY . .

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
    sh -c 'for i in CLIENT_ID CLIENT_SECRET CALLBACK_URL_GOOGLE FRONTEND SMTP_KEY SMTP_LOGIN AUTH_SVC USER_ICON_DEFAULT USER_SVC TF_SVC HISTORY_SVC NEST_APP_PORT REDIS_HOST DB_PORT DB_HOST DB_USER DB_PASSWD DB_NAME REDIS_PORT CLOUDINARY_APISECRET CLOUDINARY_CLOUDNAME CLOUDINARY_APIKEY; \
    do \
    $i=$(cat /run/secrets/$i); \
    done \
    && npm run build \'

RUN npm run migrate-generate

# for build
FROM node:18.17.1-alpine

WORKDIR /app

COPY --from=builder /usr/src/app/dist /app/dist
COPY --from=builder /usr/src/app/dataSource /app/dataSource
COPY --from=builder /usr/src/app/migration /app/migration
COPY --from=builder /usr/src/app/package.json /app/package.json
COPY --from=builder /usr/src/app/package-lock.json /app/package-lock.json

# Start the server using the production build
CMD npm run migrate-run && node dist/main.js