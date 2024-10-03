# Use original image golang as build stage
FROM golang:1.22-alpine AS build

# Set working directory inside container
WORKDIR /app

# Copy source code
COPY . .

# Download dependencies
RUN go mod tidy

# Compile aplikasi Go
RUN go build -o server.out server.go

FROM alpine:latest

WORKDIR /app

COPY --from=build /app/server.out /app/server.out

RUN addgroup -S nonroot && adduser -S nonroot -G nonroot

RUN chown -R nonroot:nonroot /app/server.out

USER nonroot:nonroot

EXPOSE 8803

ENTRYPOINT ["./server.out"]