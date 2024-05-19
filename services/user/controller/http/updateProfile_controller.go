package controllerhttp

import (
	"encoding/json"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/syafiqparadisam/paymentku/services/user/dto"
	"github.com/syafiqparadisam/paymentku/services/user/errors"
)

func (s *ControllerHTTP) UpdateBio(c *fiber.Ctx, user *dto.XUserData) error {
	dtoBio := &dto.UpdateBioDTO{}
	bodyBytes := c.Body()

	if err := json.Unmarshal(bodyBytes, dtoBio); err != nil {
		return c.Status(404).JSON(dto.APIResponse[interface{}]{StatusCode: 400, Message: errors.ErrInvalidReqBody.Error()})
	}

	result := s.usecase.UpdateBio(dtoBio, user.UserId)
	if result.StatusCode == 500 {
		fmt.Println(result)
		return c.SendStatus(result.StatusCode)
	}
	return c.Status(result.StatusCode).JSON(result)
}

func (s *ControllerHTTP) UpdateName(c *fiber.Ctx, user *dto.XUserData) error {
	dtoName := &dto.UpdateNameDTO{}
	bodyBytes := c.Body()

	if err := json.Unmarshal(bodyBytes, dtoName); err != nil {
		return c.Status(404).JSON(dto.APIResponse[interface{}]{StatusCode: 400, Message: errors.ErrInvalidReqBody.Error()})
	}

	result := s.usecase.UpdateName(dtoName, user.UserId)
	if result.StatusCode == 500 {
		fmt.Println(result)
		return c.SendStatus(result.StatusCode)
	}
	fmt.Println(result)
	return c.Status(result.StatusCode).JSON(result)
}

func (s *ControllerHTTP) UpdatePhoneNumber(c *fiber.Ctx, user *dto.XUserData) error {
	dtoPhoneNumber := &dto.UpdatePhoneNumberDTO{}
	bodyBytes := c.Body()

	if err := json.Unmarshal(bodyBytes, dtoPhoneNumber); err != nil {
		return c.Status(404).JSON(dto.APIResponse[interface{}]{StatusCode: 400, Message: errors.ErrInvalidReqBody.Error()})
	}

	result := s.usecase.UpdatePhoneNumber(dtoPhoneNumber, user.UserId)
	if result.StatusCode == 500 {
		fmt.Println(result)
		return c.SendStatus(result.StatusCode)
	}
	return c.Status(result.StatusCode).JSON(result)
}
