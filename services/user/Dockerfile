# Use original image golang as build stage
FROM golang:1.22-alpine AS build

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set working directory inside container
WORKDIR /app

# Copy module
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .


RUN --mount=type=secret,id=DB_PORT,required=true,mode=0666 \
    --mount=type=secret,id=DB_NAME,required=true,mode=0666 \
    --mount=type=secret,id=DB_USER,required=true,mode=0666 \
    --mount=type=secret,id=DB_PASSWD,required=true,mode=0666 \
    --mount=type=secret,id=DB_HOST,required=true,mode=0666 \
    --mount=type=secret,id=DB_PARAM,required=true,mode=0666 \
    --mount=type=secret,id=USER_SVC_PORT,required=true,mode=0666 \
    --mount=type=secret,id=REDIS_ADDR,required=true,mode=0666 \
    --mount=type=secret,id=GRPC_SERVER_URL,required=true,mode=0666 \
    --mount=type=secret,id=ORIGIN_URL,required=true,mode=0666 \
    DB_PORT=$(cat /run/secrets/DB_PORT) \
    DB_NAME=$(cat /run/secrets/DB_NAME) \
    DB_USER=$(cat /run/secrets/DB_USER) \
    DB_PASSWD=$(cat /run/secrets/DB_PASSWD) \
    DB_HOST=$(cat /run/secrets/DB_HOST) \
    DB_PARAM=$(cat /run/secrets/DB_PARAM) \
    USER_SVC_PORT=$(cat /run/secrets/USER_SVC_PORT) \
    REDIS_ADDR=$(cat /run/secrets/REDIS_ADDR) \
    GRPC_SERVER_URL=$(cat /run/secrets/GRPC_SERVER_URL) \
    ORIGIN_URL=$(cat /run/secrets/ORIGIN_URL) \
    go build -o /app/server.out


# Final stage
FROM alpine:3.20.2

RUN apk update && apk --no-cache add ca-certificates

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set working directory inside container
WORKDIR /app

# Copy build binary 

COPY --from=build /app/server.out /app/server.out

# Change ownership of the working directory
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

CMD [ "./server.out" ]

