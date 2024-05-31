package controllerhttp

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/syafiqparadisam/paymentku/services/user/dto"
	"github.com/syafiqparadisam/paymentku/services/user/errors"
	"go.opentelemetry.io/otel"
)

func (s *ControllerHTTP) UpdateBio(c *fiber.Ctx, user *dto.XUserData) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	tracer := otel.GetTracerProvider()
	ctx, span := tracer.Tracer("github.com/syafiqparadisam/paymentku/services/user/controller/http").Start(ctx, "update bio profile")
	defer span.End()
	dtoBio := &dto.UpdateBioDTO{}
	bodyBytes := c.Body()

	if err := json.Unmarshal(bodyBytes, dtoBio); err != nil {
		return c.Status(404).JSON(dto.APIResponse[interface{}]{StatusCode: 400, Message: errors.ErrInvalidReqBody.Error()})
	}

	result := s.usecase.UpdateBio(ctx, dtoBio, user.UserId)
	if result.StatusCode == 500 {
		fmt.Println(result)
		return c.SendStatus(result.StatusCode)
	}
	return c.Status(result.StatusCode).JSON(result)
}

func (s *ControllerHTTP) UpdateName(c *fiber.Ctx, user *dto.XUserData) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	tracer := otel.GetTracerProvider()
	ctx, span := tracer.Tracer("github.com/syafiqparadisam/paymentku/services/user/controller/http").Start(ctx, "update name profile")
	defer span.End()
	dtoName := &dto.UpdateNameDTO{}
	bodyBytes := c.Body()

	if err := json.Unmarshal(bodyBytes, dtoName); err != nil {
		return c.Status(404).JSON(dto.APIResponse[interface{}]{StatusCode: 400, Message: errors.ErrInvalidReqBody.Error()})
	}

	result := s.usecase.UpdateName(ctx, dtoName, user.UserId)
	if result.StatusCode == 500 {
		fmt.Println(result)
		return c.SendStatus(result.StatusCode)
	}
	fmt.Println(result)
	return c.Status(result.StatusCode).JSON(result)
}

func (s *ControllerHTTP) UpdatePhoneNumber(c *fiber.Ctx, user *dto.XUserData) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	tracer := otel.GetTracerProvider()
	ctx, span := tracer.Tracer("github.com/syafiqparadisam/paymentku/services/user/controller/http").Start(ctx, "update phone number")
	defer span.End()
	dtoPhoneNumber := &dto.UpdatePhoneNumberDTO{}
	bodyBytes := c.Body()

	if err := json.Unmarshal(bodyBytes, dtoPhoneNumber); err != nil {
		return c.Status(404).JSON(dto.APIResponse[interface{}]{StatusCode: 400, Message: errors.ErrInvalidReqBody.Error()})
	}

	result := s.usecase.UpdatePhoneNumber(ctx, dtoPhoneNumber, user.UserId)
	if result.StatusCode == 500 {
		fmt.Println(result)
		return c.SendStatus(result.StatusCode)
	}
	return c.Status(result.StatusCode).JSON(result)
}
