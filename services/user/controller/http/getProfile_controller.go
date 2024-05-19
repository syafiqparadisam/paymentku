package controllerhttp

import (
	"encoding/json"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/syafiqparadisam/paymentku/services/user/dto"
)

func (s *ControllerHTTP) GetUserProfile(c *fiber.Ctx, user *dto.XUserData) error {
	
	result := s.usecase.GetUserProfile(user.UserId)
	if result.StatusCode == 500 {
		fmt.Println(result)
		return c.SendStatus(result.StatusCode)
	}
	return c.Status(result.StatusCode).JSON(result)
}

func (s *ControllerHTTP) GetUserProfileByAccNumber(c *fiber.Ctx, _ *dto.XUserData) error {
	bodyBytes := c.Body()
	dtoAccNum := &dto.FindUserByAccNumber{}
	if err := json.Unmarshal(bodyBytes,dtoAccNum); err != nil {
		return c.Status(400).JSON(dto.APIResponse[interface{}]{StatusCode: 400, Message: err.Error()})
	}
	result := s.usecase.GetUserProfileByAccNumber(dtoAccNum)
	if result.StatusCode == 500 {
		fmt.Println(result)
		return c.SendStatus(result.StatusCode)
	}
	return c.Status(result.StatusCode).JSON(result)
}
