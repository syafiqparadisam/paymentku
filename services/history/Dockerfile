# Use original image golang as build stage
FROM golang:1.22-alpine

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

# Change ownership of the working directory
RUN chown -R appuser:appgroup /app

USER appuser

RUN --mount=type=secret,id=DB_PORT,required=true,mode=0666 \
    --mount=type=secret,id=DB_NAME,required=true,mode=0666 \
    --mount=type=secret,id=DB_USER,required=true,mode=0666 \
    --mount=type=secret,id=DB_PASSWD,required=true,mode=0666 \
    --mount=type=secret,id=DB_HOST,required=true,mode=0666 \
    --mount=type=secret,id=DB_PARAM,required=true,mode=0666 \
    --mount=type=secret,id=HISTORY_SVC_PORT,required=true,mode=0666 \
    --mount=type=secret,id=GRPC_SERVER_URL,required=true,mode=0666 \
    --mount=type=secret,id=ORIGIN_URL,required=true,mode=0666 \
    sh -c 'for i in DB_PORT DB_NAME DB_USER DB_PASSWD DB_HOST DB_PARAM HISTORY_SVC_PORT GRPC_SERVER_URL ORIGIN_URL; \
   do \
        echo "$i=$(cat /run/secrets/$i)" >> /etc/environment; \ 
    done \
    && go build -o /app/server.out'


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