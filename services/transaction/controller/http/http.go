package controllerhttp

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/rs/zerolog"
	"github.com/syafiqparadisam/paymentku/services/transaction/config"
	"github.com/syafiqparadisam/paymentku/services/transaction/dto"
	"github.com/syafiqparadisam/paymentku/services/transaction/errors"
	"github.com/syafiqparadisam/paymentku/services/transaction/usecase"
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
)

type ControllerHTTP struct {
	usecase usecase.UsecaseInterface
}

type decodeJWTTokenFunc func(w http.ResponseWriter, r *http.Request, user *dto.XUserData) error
type HandlerFunc func(w http.ResponseWriter, r *http.Request) error

func WriteJSON(w http.ResponseWriter, statusCode int, message any) error {
	w.Header().Add("Content-type", "application/json")
	w.WriteHeader(statusCode)
	return json.NewEncoder(w).Encode(&message)
}

// func MakeHTTPHandler(f HandlerFunc, method string) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		if r.Method != method {
// 			WriteJSON(w, http.StatusMethodNotAllowed, dto.APIResponse[interface{}]{StatusCode: http.StatusMethodNotAllowed, Message: errors.ErrMethodNotAllowed.Error()})
// 		} else {
// 			start := time.Now()
// 			log := config.Log()
// 			header := r.Header
// 			res := r.Response
// 			fmt.Println(res)

// 			defer func() {

// 				if r := recover(); r != nil {
// 					log.WithLevel(zerolog.PanicLevel).Err(r.(error)).Str("Request-id", header.Get("X-Request-Id")).Msg("Server paniccing")
// 					w.Header().Set("Retry-After", "60")
// 					http.Error(w, "", http.StatusInternalServerError)
// 				}
// 				log.Info().Str("Request-id", header.Get("X-Request-Id")).Str("User-agent", header.Get("User-Agent")).Str("Origin", header.Get("Origin")).Str("Method", r.Method).Dur("Latency (milisecond)", time.Duration(time.Duration(time.Since(start)).Milliseconds())).Str("Path", r.URL.Path).Interface("Query", r.URL.Query()).Int("Status", 200).Str("Ip", r.RemoteAddr).Msg("Request Logs")
// 			}()
// 			err := f(w, r)
// 			if err != nil {
// 				fmt.Println(err)
// 				panic(err)
// 			}
// 		}
// 	}
// }

func MakeHTTPHandler(f HandlerFunc, method string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != method {
			WriteJSON(w, http.StatusMethodNotAllowed, dto.APIResponse[interface{}]{StatusCode: http.StatusMethodNotAllowed, Message: errors.ErrMethodNotAllowed.Error()})
			return
		}

		start := time.Now()
		log := config.Log()
		header := r.Header

		defer func() {
			if rec := recover(); rec != nil {
				log.WithLevel(zerolog.PanicLevel).Err(rec.(error)).Str("Request-id", header.Get("X-Request-Id")).Msg("Server paniccing")
				http.Error(w, "", http.StatusInternalServerError)
			}
			log.Info().Str("Request-id", header.Get("X-Request-Id")).Str("User-agent", header.Get("User-Agent")).Str("Origin", header.Get("Origin")).Str("Method", r.Method).Dur("Latency (milisecond)", time.Duration(time.Since(start).Milliseconds())).Str("Path", r.URL.Path).Interface("Query", r.URL.Query()).Str("Ip", r.RemoteAddr).Msg("Request Logs")
		}()

		if err := f(w, r); err != nil {
			panic(err)
		}
	}
}

func ExstractHeaderXUserData(f decodeJWTTokenFunc) HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) error {
		query := r.URL.Query()
		userid := query.Get("userid")
		fmt.Println(userid)
		xUserData := &dto.XUserData{UserId: userid}

		errFunc := f(w, r, xUserData)
		if errFunc != nil {
			return errFunc
		}
		return nil
	}
}

func NewControllerHTTP(usecase usecase.UsecaseInterface) *ControllerHTTP {
	return &ControllerHTTP{usecase: usecase}
}

func (s *ControllerHTTP) Routes() http.Handler {
	mux := http.NewServeMux()
	mux.Handle("POST /topup", otelhttp.NewHandler(MakeHTTPHandler(ExstractHeaderXUserData(s.HandlerTopUp), http.MethodPost), "topup controller"))
	mux.Handle("POST /transfer", otelhttp.NewHandler(MakeHTTPHandler(ExstractHeaderXUserData(s.HandleTransfer), http.MethodPost), "transfer controller"))
	return mux
}
