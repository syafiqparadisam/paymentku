package controllerhttp

import (
	"fmt"
	"time"

	"github.com/cloudinary/cloudinary-go"
	"github.com/gofiber/contrib/otelfiber/v2"
	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog"
	"github.com/syafiqparadisam/paymentku/services/user/config"
	"github.com/syafiqparadisam/paymentku/services/user/dto"
	"github.com/syafiqparadisam/paymentku/services/user/usecase"
)

type ControllerHTTP struct {
	usecase usecase.UsecaseInterface
}

func NewControllerHTTP(usecase usecase.UsecaseInterface) *ControllerHTTP {
	return &ControllerHTTP{
		usecase,
	}
}

type HTTPFunc func(c *fiber.Ctx, user *dto.XUserData) error
type UploadFunc func(c *fiber.Ctx, user *dto.XUserData, cld *cloudinary.Cloudinary) error
type HTTPFuncLogger func(c *fiber.Ctx) error

func ExstractJWTToken(f HTTPFunc) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userid := c.Query("userid")
		fmt.Println(c.Method())
		XuserData := &dto.XUserData{UserId: userid}

		err := f(c, XuserData)
		if err != nil {
			return err
		}
		return nil
	}
}

func Logger(f HTTPFuncLogger) fiber.Handler {
	return func(c *fiber.Ctx) error {
		start := time.Now()
		res := c.Response()
		reqId := c.Get("X-Request-Id")
		log := config.Log()

		defer func() {
			if r := recover(); r != nil {
				c.SendStatus(500)
				log.WithLevel(zerolog.PanicLevel).Err(r.(error)).Str("Request-id", reqId).Msg("Server paniccing")
			}
			log.Info().Str("Request-id", reqId).Str("User-agent", c.Get("User-Agent")).Str("Origin", c.Get("Origin", "")).Str("Method", c.Method()).Dur("Latency (milisecond)", time.Duration(time.Duration(time.Since(start)).Milliseconds())).Str("Path", c.Path()).Interface("Query", c.Queries()).Int("Status", res.StatusCode()).Str("Ip", c.IP()).Msg("Request Logs")
		}()

		err := f(c)
		if err != nil {
			log.WithLevel(zerolog.PanicLevel).Err(err).Str("Request-id", reqId).Msg("Server paniccing")
			panic(err)
		}
		return nil
	}
}

func (s *ControllerHTTP) Routes() *fiber.App {
	app := fiber.New(fiber.Config{EnableTrustedProxyCheck: true})

	app.Use(otelfiber.Middleware())

	// println("success middlewarw")
	app.Get("/", Logger(ExstractJWTToken(s.GetUserProfile)))
	app.Post("/accountNumber", Logger(ExstractJWTToken(s.GetUserProfileByAccNumber)))
	app.Patch("/bio", Logger(ExstractJWTToken(s.UpdateBio)))
	app.Patch("/name", Logger(ExstractJWTToken(s.UpdateName)))
	app.Patch("/phonenumber", Logger(ExstractJWTToken(s.UpdatePhoneNumber)))
	return app
}
