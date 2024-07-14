# Use original image golang as build stage
FROM golang:1.22-alpine

# Set working directory inside container
WORKDIR /app

# Copy source code
COPY . . 

# Download dependencies
RUN go mod tidy

# Compile aplikasi Go
RUN go build -o server server.go

USER nonroot:nonroot

ENTRYPOINT ["./server"]