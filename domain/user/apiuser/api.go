package apiuser

import (
	"fmt"
	"os"

	jwtWare "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/fiber/v2"
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

	// app.Use(logger.New(logger.Config{
	// 	Format:     "${pid} ${status} - ${method} ${path}\n",
	// 	TimeFormat: "02-Jan-2006",
	// 	TimeZone:   "America/New_York",
	// }))
	fmt.Println(os.Getenv("JWT_SECRET"))
	// MIDDLEWARE JWT TOKEN
	app.Use(jwtWare.New(jwtWare.Config{
		SigningKey: jwtWare.SigningKey{Key: []byte(string(os.Getenv("JWT_SECRET")))},
	}))
	println("success middlewarw")
	app.Get("/", s.getUserProfile)
	return app.Listen(s.Port)
}
