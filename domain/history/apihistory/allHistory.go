package apihistory

import (
	"net/http"

	"github.com/syafiqparadisam/paymentku/shared"
)

func (s *Server) HandleAllHistory(w http.ResponseWriter, r *http.Request, decode *shared.UserJwtDecode) error {
	if r.Method == "GET" {
		result := s.Svc.GetAllHistory(decode)
		if result.StatusCode != http.StatusOK {
			return shared.WriteJSON(w, result.StatusCode, result)
		}

		return shared.WriteJSON(w, result.StatusCode, result)
	}
	return shared.WriteJSON(w, http.StatusBadRequest, shared.APIResponse{Error: "Method not allowed"})
}
