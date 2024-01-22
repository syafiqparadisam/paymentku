package handler

import "github.com/gofiber/fiber/v3"

func (s *Server) GetUserProfile(c fiber.Ctx) error {
	// user := c.Locals("user").(*jwt.Token)
	// claims := user.Claims.(jwt.MapClaims)
	// name := claims["user"].(string)
	// fmt.Println(name)

	return c.JSON(map[string]any{"name": "syafiq"})

}
