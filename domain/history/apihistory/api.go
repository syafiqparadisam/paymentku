package apihistory

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/syafiqparadisam/paymentku/domain/history/providerhistory"
	"github.com/syafiqparadisam/paymentku/shared"
)

type Server struct {
	svc  providerhistory.ProviderMethod
	port string
}

type decodeJWTTokenFunc func(w http.ResponseWriter, r *http.Request, decode *shared.UserJwtDecode) error
type HandlerFunc func(w http.ResponseWriter, r *http.Request) error

func makeHTTPHandler(f HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := f(w, r)
		if err != nil {
			shared.WriteJSON(w, http.StatusBadRequest, shared.APIResponse{StatusCode: http.StatusBadRequest, Error: err.Error()})
		}
	}
}

func decodeJWTToken(f decodeJWTTokenFunc) HandlerFunc {
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
	return &Server{svc: svc, port: port}
}

func (s *Server) Run() error {
	http.HandleFunc("/topup", makeHTTPHandler(decodeJWTToken(s.handleTopUpHistory)))
	http.HandleFunc("/topup/", makeHTTPHandler(decodeJWTToken(s.handleTopUpHistoryById)))
	http.HandleFunc("/", makeHTTPHandler(decodeJWTToken(s.handleAllHistory)))
	http.HandleFunc("/transfer", makeHTTPHandler(decodeJWTToken(s.handleTransferHistory)))
	http.HandleFunc("/transfer/", makeHTTPHandler(decodeJWTToken(s.handleTransferHistoryById)))
	defer fmt.Printf("History Server is running on port %s\n", s.port)
	return http.ListenAndServe(s.port, nil)
}
