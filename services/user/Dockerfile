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

CMD go build -o server.out . && ./server.out