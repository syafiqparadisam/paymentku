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

# Change ownership of the working directory
RUN chown -R appuser:appgroup /app

USER appuser

RUN go build -o /app/server.out


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
