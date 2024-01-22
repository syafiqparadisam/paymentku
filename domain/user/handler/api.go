package handler

import (
	"fmt"
	"log"
	"os"

	jwtWare "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/logger"
)

type Server struct {
	Port string
}

func NewApiServer(port string) *Server {
	return &Server{
		Port: port,
	}
}

func (s *Server) Run() {
	app := fiber.New()

	app.Use(logger.New(logger.Config{
		Format:     "${pid} ${status} - ${method} ${path}\n",
		TimeFormat: "02-Jan-2006",
		TimeZone:   "America/New_York",
	}))
	fmt.Println(os.Getenv("JWT_SECRET"))
	// MIDDLEWARE JWT TOKEN
	app.Use(jwtWare.New(jwtWare.Config{
		SigningKey: jwtWare.SigningKey{Key: []byte(os.Getenv("JWT_SECRET"))},
	}))
	println("success middlewarw")
	app.Get("/", s.GetUserProfile)

	log.Fatal(app.Listen(s.Port))
}
