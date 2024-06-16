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


# SET ARGS WHEN BUILD TIME
ARG DB_PORT
ARG DB_NAME
ARG DB_HOST
ARG DB_USER
ARG DB_PASSWD
ARG HISTORY_SVC_PORT
ARG GRPC_SERVER_URL
ARG DB_PARAM
ARG ORIGIN_URL

# SET ENV FROM ARGS
ENV DB_PORT=${DB_PORT}
ENV DB_NAME=${DB_NAME}
ENV DB_HOST=${DB_HOST}
ENV DB_USER=${DB_USER}
ENV DB_PASSWD=${DB_PASSWD}
ENV HISTORY_SVC_PORT=${HISTORY_SVC_PORT}
ENV GRPC_SERVER_URL=${GRPC_SERVER_URL}
ENV DB_PARAM=${DB_PARAM}
ENV ORIGIN_URL=${ORIGIN_URL}

# Compile aplikasi Go
RUN CGO_ENABLED=0 GOOS=linux go build server.go

# Deploy the application binary into a lean image
FROM gcr.io/distroless/base-debian11 AS build-release-stage

WORKDIR /

COPY --from=build-stage /server /server

EXPOSE 8803

USER nonroot:nonroot

ENTRYPOINT ["./server"]