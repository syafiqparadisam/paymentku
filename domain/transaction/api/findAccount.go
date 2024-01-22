package api

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/syafiqparadisam/paymentku/domain/transaction/dto"
	"github.com/syafiqparadisam/paymentku/shared"
)

func (s *Server) handleFindUserByAccount(w http.ResponseWriter, r *http.Request, _ *shared.UserJwtDecode) error {
	if r.Method == "GET" {
		dto := &dto.FindUserRequest{}
		if err := json.NewDecoder(r.Body).Decode(dto); err != nil {
			return shared.WriteJSON(w, http.StatusBadRequest, shared.APIResponse{StatusCode: http.StatusBadRequest, Error: err.Error()})
		}
		result := s.svc.FindAccount(dto)
		if result.StatusCode != http.StatusOK {
			return shared.WriteJSON(w, result.StatusCode, result)
		}
		return shared.WriteJSON(w, result.StatusCode, result)
	} else {
		return shared.WriteJSON(w, http.StatusBadRequest, shared.APIResponse{StatusCode: http.StatusBadRequest, Error: fmt.Errorf("Method not allowed").Error()})
	}
}
