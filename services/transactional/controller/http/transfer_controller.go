package controller_http

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/syafiqparadisam/paymentku/services/transactional/dto"
)

// gorong mariiii.
func (s *ControllerHTTP) HandleTransfer(w http.ResponseWriter, r *http.Request, user *dto.XUserData) error {
	tfReq := &dto.TransferRequest{}
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	if err := json.NewDecoder(r.Body).Decode(tfReq); err != nil {
		return WriteJSON(w, http.StatusBadRequest, dto.APIResponse[interface{}]{StatusCode: http.StatusBadRequest, Message: "Invalid input format"})
	}
	result := s.usecase.InsertHistoryTransfer(ctx, tfReq, user)
	if result.StatusCode != http.StatusOK {
		return WriteJSON(w, result.StatusCode, result)
	}
	return WriteJSON(w, result.StatusCode, result)
}
