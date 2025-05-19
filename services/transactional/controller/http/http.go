package controller_http

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/rs/zerolog"
	"github.com/syafiqparadisam/paymentku/services/transactional/config"
	"github.com/syafiqparadisam/paymentku/services/transactional/dto"
	"github.com/syafiqparadisam/paymentku/services/transactional/errors"
	"github.com/syafiqparadisam/paymentku/services/transactional/usecase"
)

type ControllerHTTP struct {
	usecase usecase.UsecaseInterface
	cfg     *config.HTTPConfig
}

func WriteJSON(w http.ResponseWriter, statusCode int, message any) error {
	w.Header().Add("Content-type", "application/json")
	w.WriteHeader(statusCode)
	return json.NewEncoder(w).Encode(&message)
}

type decodeJWTTokenFunc func(w http.ResponseWriter, r *http.Request, user *dto.XUserData) error
type HandlerFunc func(w http.ResponseWriter, r *http.Request) error

func MakeHTTPHandler(f HandlerFunc, methods ...string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		log := config.Log()
		header := r.Header
		internalSecret := os.Getenv("INTERNAL_SECRET")
		defer func() {
			if r := recover(); r != nil {
				log.WithLevel(zerolog.PanicLevel).Err(r.(error)).Str("Request-id", header.Get("X-Request-Id")).Msg("Server panicing")
				http.Error(w, "", http.StatusInternalServerError)
			}
			log.Info().Str("Request-id", header.Get("X-Request-Id")).Str("User-agent", header.Get("User-Agent")).Str("Origin", header.Get("Origin")).Str("Method", r.Method).Dur("Latency (milisecond)", time.Duration(time.Duration(time.Since(start)).Milliseconds())).Str("Path", r.URL.Path).Interface("Query", r.URL.Query()).Str("Ip", r.RemoteAddr).Msg("Request Logs")

		}()


		if header.Get("X-Internal-Secret") != internalSecret || header.Get("X-Request-id") == ""{
			WriteJSON(w, http.StatusForbidden, dto.APIResponse[interface{}]{StatusCode: http.StatusForbidden, Message: errors.ErrUnauthorizedInternalAccess.Error()})
			return
		}

		if r.Method != methods[0] && r.Method != methods[1] {
			WriteJSON(w, http.StatusMethodNotAllowed, dto.APIResponse[interface{}]{StatusCode: http.StatusMethodNotAllowed, Message: errors.ErrMethodNotAllowed.Error()})
			return
		}
		err := f(w, r)
		if err != nil {
			panic(err)
		}
	}
}

func (s *ControllerHTTP) ExstractHeaderXUserData(f decodeJWTTokenFunc) HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) error {
		userid := r.Header.Get("X-Userid")
		if userid == "" {
			return WriteJSON(w, http.StatusForbidden, dto.APIResponse[interface{}]{StatusCode: http.StatusForbidden, Message: "Unknown users"})
		}
		XUserData := &dto.XUserData{UserId: userid}

		if err := f(w, r, XUserData); err != nil {
			return err
		}

		return nil
	}
}

func NewControllerHTTP(usecase usecase.UsecaseInterface, cfg *config.HTTPConfig) *ControllerHTTP {
	return &ControllerHTTP{usecase: usecase, cfg: cfg}
}

func ExtractIDFromPath(r *http.Request, prefix string) (int, error) {
	path := strings.TrimPrefix(r.URL.Path, prefix)
	idStr := strings.Trim(path, "/")
	return strconv.Atoi(idStr)
}

func (s *ControllerHTTP) Routes() http.Handler {
	mux := http.NewServeMux()
	mux.Handle("/history/transfer", MakeHTTPHandler(s.ExstractHeaderXUserData(s.HandleAllTransferHistory), http.MethodGet, http.MethodDelete))
	mux.Handle("/history/topup", MakeHTTPHandler(s.ExstractHeaderXUserData(s.HandleAllTopUpHistory), http.MethodGet, http.MethodDelete))
	mux.Handle("/history/topup/{id}", MakeHTTPHandler(s.ExstractHeaderXUserData(s.HandleTopUpHistoryById), http.MethodGet, http.MethodDelete))
	mux.Handle("/history/transfer/{id}", MakeHTTPHandler(s.ExstractHeaderXUserData(s.HandleTransferHistoryById), http.MethodGet, http.MethodDelete))
	mux.Handle("POST /topup", MakeHTTPHandler(s.ExstractHeaderXUserData(s.HandlerTopUp), http.MethodPost))
	mux.Handle("POST /transfer", MakeHTTPHandler(s.ExstractHeaderXUserData(s.HandleTransfer), http.MethodPost))
	fmt.Printf("Server listening on port%s\n", s.cfg.Port)

	return mux
}
