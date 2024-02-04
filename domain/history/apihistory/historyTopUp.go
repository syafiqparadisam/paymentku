package apihistory

import (
	"fmt"
	"net/http"

	"github.com/syafiqparadisam/paymentku/domain/history/utils"

	"github.com/syafiqparadisam/paymentku/shared"
)

func (s *Server) HandleTopUpHistory(w http.ResponseWriter, r *http.Request, decode *shared.UserJwtDecode) error {

	if r.Method == "GET" {

		result := s.Svc.GetAllTopUpHistory(decode)
		if result.StatusCode != http.StatusOK {
			return shared.WriteJSON(w, result.StatusCode, result)
		}
		return shared.WriteJSON(w, result.StatusCode, result)
	} else {
		return shared.WriteJSON(w, http.StatusBadRequest, shared.APIResponse{Error: fmt.Errorf("Method not allowed").Error()})
	}
}

func (s *Server) HandleTopUpHistoryById(w http.ResponseWriter, r *http.Request, decode *shared.UserJwtDecode) error {
	if r.Method == "GET" {

		idHistory, errParseUrl := utils.ParseURlParamsToObjectId(r.URL.Path)
		if errParseUrl != nil {
			return shared.WriteJSON(w, http.StatusBadRequest, shared.APIResponse{StatusCode: http.StatusBadRequest, Error: errParseUrl.Error()})
		}
		result := s.Svc.GetAllTopUpHistoryByIdHistory(idHistory, decode)
		if result.StatusCode != http.StatusOK {
			return shared.WriteJSON(w, result.StatusCode, result)
		}
		return shared.WriteJSON(w, result.StatusCode, result)
	} else {
		return shared.WriteJSON(w, http.StatusBadRequest, shared.APIResponse{StatusCode: http.StatusBadRequest, Error: "Method not allowed"})
	}
}
