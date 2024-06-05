# Use original image golang as build stage
FROM golang:1.22 AS build-stage

# Set working directory inside container
WORKDIR /app

# Copy go.mod go.sum into /app
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY *.go ./ 

# Compile aplikasi Go
RUN CGO_ENABLED=0 GOOS=linux go build server.go

# Deploy the application binary into a lean image
FROM gcr.io/distroless/base-debian11 AS build-release-stage

WORKDIR /

COPY --from=build-stage /server /server

EXPOSE 8802

USER nonroot:nonroot

ENTRYPOINT ["./server"]