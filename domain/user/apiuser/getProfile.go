package apiuser

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func (s *Server) getUserProfile(c *fiber.Ctx) error {
	user := c.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	username := claims["user"].(string)
	email := claims["email"].(string)
	// get user from db

	profile := s.svc.GetUserProfile(username, email)
	if profile.StatusCode != http.StatusOK {
		return c.JSON(profile)
	}
	return c.JSON(profile)

}
