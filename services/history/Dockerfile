# Gunakan image resmi Golang sebagai base image
FROM golang:1.22 AS builder

# Set working directory di dalam container
WORKDIR /app

# Copy semua file dari direktori proyek Anda ke dalam direktori kerja di dalam container
COPY . .

# Compile aplikasi Go
RUN go build server.go

# Buat image akhir yang lebih kecil dengan menggunakan image Alpine Linux
FROM alpine:latest

# Set working directory di dalam container
WORKDIR /app

# Salin executable yang telah dikompilasi dari builder stage
COPY --from=builder /app/server .