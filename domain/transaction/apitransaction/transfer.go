package apitransaction

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/syafiqparadisam/paymentku/domain/transaction/dtotransaction"
	"github.com/syafiqparadisam/paymentku/shared"
)

// gorong mariiii
func (s *Server) handleTransfer(w http.ResponseWriter, r *http.Request, decode *shared.UserJwtDecode) error {
	if r.Method == "POST" {
		req := &dtotransaction.TransferRequest{}
		if err := json.NewDecoder(r.Body).Decode(req); err != nil {
			return shared.WriteJSON(w, http.StatusBadRequest, shared.APIResponse{StatusCode: http.StatusBadRequest, Error: fmt.Errorf("bad request").Error()})
		}
		result := s.svc.NewHistoryTransfer(req, decode)
		if result.StatusCode != http.StatusOK {
			return shared.WriteJSON(w, result.StatusCode, result)
		}
		return shared.WriteJSON(w, result.StatusCode, result)
	} else {
		return shared.WriteJSON(w, http.StatusBadRequest, shared.APIResponse{StatusCode: http.StatusBadRequest, Error: fmt.Errorf("Method not allowed").Error()})
	}
}
