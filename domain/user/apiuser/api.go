package apiuser

import (
	"fmt"
	"os"

	jwtWare "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/logger"
	"github.com/syafiqparadisam/paymentku/domain/user/provideruser"
)

type Server struct {
	svc  provideruser.ProviderMethod
	Port string
}

func NewServer(svc provideruser.ProviderMethod, port string) *Server {
	return &Server{
		svc:  svc,
		Port: port,
	}
}

func (s *Server) Run() error {
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
	app.Get("/", func(c fiber.Ctx) error {
		return c.JSON(map[string]any{"hello": "anjayay"})
	})
	defer fmt.Printf("User Server is running on port %s", s.Port)
	return app.Listen(s.Port)
}
