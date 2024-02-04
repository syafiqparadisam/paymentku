package apihistory

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/syafiqparadisam/paymentku/domain/history/providerhistory"
	"github.com/syafiqparadisam/paymentku/shared"
)

type Server struct {
	Svc  providerhistory.ProviderMethod
	port string
}

type decodeJWTTokenFunc func(w http.ResponseWriter, r *http.Request, decode *shared.UserJwtDecode) error
type HandlerFunc func(w http.ResponseWriter, r *http.Request) error

func MakeHTTPHandler(f HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := f(w, r)
		if err != nil {
			shared.WriteJSON(w, http.StatusBadRequest, shared.APIResponse{StatusCode: http.StatusBadRequest, Error: err.Error()})
		}
	}
}

func DecodeJWTToken(f decodeJWTTokenFunc) HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) error {
		authHeader := r.Header.Get("Authorization")
		if (len(authHeader) == 0) || (authHeader == "") {
			return fmt.Errorf("authorization is missing")
		}
		decode, err := shared.VerifyAuth(strings.Split(authHeader, " ")[1])
		if err != nil {
			return fmt.Errorf("authorization is wrong")
		}
		errFunc := f(w, r, decode)
		if errFunc != nil {
			return errFunc
		}
		return nil
	}
}

func NewServer(svc providerhistory.ProviderMethod, port string) *Server {
	return &Server{Svc: svc, port: port}
}

func (s *Server) Run() error {
	http.HandleFunc("/topup", MakeHTTPHandler(DecodeJWTToken(s.HandleTopUpHistory)))
	http.HandleFunc("/topup/",MakeHTTPHandler(DecodeJWTToken(s.HandleTopUpHistoryById)))
	http.HandleFunc("/", MakeHTTPHandler(DecodeJWTToken(s.HandleAllHistory)))
	http.HandleFunc("/transfer", MakeHTTPHandler(DecodeJWTToken(s.HandleTransferHistory)))
	http.HandleFunc("/transfer/",MakeHTTPHandler(DecodeJWTToken(s.HandleTransferHistoryById)))
	defer fmt.Printf("History Server is running on port %s\n", s.port)
	return http.ListenAndServe(s.port, nil)
}
