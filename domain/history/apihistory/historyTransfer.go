package apihistory

import (
	"net/http"
	"github.com/syafiqparadisam/paymentku/domain/history/utils"
	"github.com/syafiqparadisam/paymentku/shared"
)

func (s *Server) HandleTransferHistory(w http.ResponseWriter, r *http.Request, decode *shared.UserJwtDecode) error {
	if r.Method == "GET" {

		// find id from this user
		result := s.Svc.GetAllTransferHistory(decode)
		if result.StatusCode != http.StatusOK {
			return shared.WriteJSON(w, result.StatusCode, result)
		}

		return shared.WriteJSON(w, result.StatusCode, result)
	} else {
		return shared.WriteJSON(w, http.StatusBadRequest, shared.APIResponse{Error: "Method not allowed"})
	}
}

func (s *Server) HandleTransferHistoryById(w http.ResponseWriter, r *http.Request, decode *shared.UserJwtDecode) error {
	if r.Method == "GET" {

		idHistory, errParseUrl := utils.ParseURlParamsToObjectId(r.URL.Path)
		if errParseUrl != nil {
			return shared.WriteJSON(w, http.StatusBadRequest, shared.APIResponse{StatusCode: http.StatusBadRequest, Error: errParseUrl.Error()})
		}
		result := s.Svc.GetAllTransferHistoryByIdHistory(idHistory, decode)
		if result.StatusCode != http.StatusOK {
			return shared.WriteJSON(w, result.StatusCode, result)
		}
		return shared.WriteJSON(w, result.StatusCode, result)

	} else {
		return shared.WriteJSON(w, http.StatusBadRequest, shared.APIResponse{StatusCode: http.StatusBadRequest, Error: "Method not allowed"})
	}
}
