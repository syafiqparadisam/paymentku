package controllerhttp

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/syafiqparadisam/paymentku/services/user/dto"
	"go.opentelemetry.io/otel"
)

func (s *ControllerHTTP) GetUserProfile(c *fiber.Ctx, user *dto.XUserData) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	tracer := otel.GetTracerProvider()
	ctx, span := tracer.Tracer("github.com/syafiqparadisam/paymentku/services/user/controller/http").Start(ctx, "get User Profile")
	defer span.End()
	result := s.usecase.GetUserProfile(ctx, user.UserId)
	if result.StatusCode == 500 {
		fmt.Println(result)
		return c.SendStatus(result.StatusCode)
	}
	return c.Status(result.StatusCode).JSON(result)
}

func (s *ControllerHTTP) GetUserProfileByAccNumber(c *fiber.Ctx, _ *dto.XUserData) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	tracer := otel.GetTracerProvider()
	ctx, span := tracer.Tracer("github.com/syafiqparadisam/paymentku/services/user/controller/http").Start(ctx, "get User Profile By AccountNumber")
	defer span.End()
	bodyBytes := c.Body()
	dtoAccNum := &dto.FindUserByAccNumber{}
	if err := json.Unmarshal(bodyBytes, dtoAccNum); err != nil {
		return c.Status(400).JSON(dto.APIResponse[interface{}]{StatusCode: 400, Message: err.Error()})
	}
	result := s.usecase.GetUserProfileByAccNumber(ctx, dtoAccNum)
	if result.StatusCode == 500 {
		fmt.Println(result)
		return c.SendStatus(result.StatusCode)
	}
	return c.Status(result.StatusCode).JSON(result)
}
