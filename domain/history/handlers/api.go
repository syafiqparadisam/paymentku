package handlers

import (
	"fmt"
	"historyservice/db"
	"historyservice/middleware"
	"historyservice/utils"
	"strings"

	"log"
	"net/http"
)

type APIErrMessage struct {
	StatusCode int `json:"statusCode"`
	Error      any `json:"error"`
}

type APIResponse struct {
	StatusCode int    `json:"statusCode"`
	Data       any    `json:"data"`
	Message    string `json:"message"`
}

type Server struct {
	Port     string
	Topup    db.TopUpProvider
	Transfer db.TransferProvider
	Sql      db.MySqlProvider
}

type HandlerFunc func(w http.ResponseWriter, r *http.Request) error

type decodeJWTTokenFunc func(w http.ResponseWriter, r *http.Request, decode *middleware.UserJwtDecode) error

func makeHTTPHandler(f HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := f(w, r)
		if err != nil {
			utils.WriteJSON(w, http.StatusBadRequest, APIErrMessage{StatusCode: http.StatusBadRequest, Error: err.Error()})
		}
	}
}

func decodeJWTToken(f decodeJWTTokenFunc) HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) error {
		authHeader := r.Header.Get("Authorization")
		if (len(authHeader) == 0) || (authHeader == "") {
			return fmt.Errorf("authorization is missing")
		}
		decode, err := middleware.VerifyAuth(strings.Split(authHeader, " ")[1])
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
func NewApiServer(topup db.TopUpProvider, transfer db.TransferProvider, mysql db.MySqlProvider, port string) *Server {

	return &Server{Topup: topup, Transfer: transfer, Sql: mysql, Port: port}
}

func (s *Server) Run() {
	http.HandleFunc("/topup", makeHTTPHandler(decodeJWTToken(s.handleTopUpHistory)))
	http.HandleFunc("/topup/", makeHTTPHandler(decodeJWTToken(s.handleTopUpHistoryById)))
	http.HandleFunc("/", makeHTTPHandler(decodeJWTToken(s.handleAllHistory)))
	http.HandleFunc("/transfer", makeHTTPHandler(decodeJWTToken(s.handleTransferHistory)))
	http.HandleFunc("/transfer/", makeHTTPHandler(decodeJWTToken(s.handleTransferHistoryById)))
	fmt.Printf("Server is running on port %s\n", s.Port)
	log.Fatal(http.ListenAndServe(s.Port, nil))
}
