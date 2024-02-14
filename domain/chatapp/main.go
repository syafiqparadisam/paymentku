package main

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()
	app.Use(func(c *fiber.Ctx) error {
		c.Set("Access-Control-Allow-Origin", "*")
		c.Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept")
		c.Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
		return c.Next()
	})
	// Endpoint SSE
	app.Get("/sse", func(c *fiber.Ctx) error {
		c.Set("Content-Type", "text/event-stream")
		c.Set("Cache-Control", "no-cache")
		c.Set("Connection", "keep-alive")

		// Dummy data untuk dikirim ke klien
		data := "Hello, SSE!"

		// Kirim data ke klien setiap 2 detik
		for {
			c.JSON(data)
			fmt.Println(data)
			time.Sleep(2 * time.Second)
		}
	})

	// Jalankan server
	app.Listen(":8080")
}
