package main

import (
	"log"
	"userprofile/handler"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(".env"); err != nil {
		log.Fatal(err)
	}
	server := handler.NewApiServer(":8802")
	server.Run()
}
