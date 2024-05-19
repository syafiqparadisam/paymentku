package controllerhttp

import (
	"encoding/json"
	"net/http"

	"github.com/syafiqparadisam/paymentku/services/transaction/dto"
)

// gorong mariiii.
func (s *ControllerHTTP) HandleTransfer(w http.ResponseWriter, r *http.Request, user *dto.XUserData) error {
	tfReq := &dto.TransferRequest{}
	if err := json.NewDecoder(r.Body).Decode(tfReq); err != nil {
		return WriteJSON(w, http.StatusBadRequest, dto.APIResponse[interface{}]{StatusCode: http.StatusBadRequest, Message: "Invalid input format"})
	}
	result := s.usecase.InsertHistoryTransfer(tfReq, user)
	if result.StatusCode != http.StatusOK {
		return WriteJSON(w, result.StatusCode, result)
	}
	return WriteJSON(w, result.StatusCode, result)
}
