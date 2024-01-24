package apitransaction

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/syafiqparadisam/paymentku/domain/transaction/dtotransaction"
	"github.com/syafiqparadisam/paymentku/shared"
)

func (s *Server) handlerTopUp(w http.ResponseWriter, r *http.Request, decode *shared.UserJwtDecode) error {
	if r.Method == "POST" {

		req := &dtotransaction.TopUpRequest{}
		if err := json.NewDecoder(r.Body).Decode(req); err != nil {
			return shared.WriteJSON(w, http.StatusBadRequest, shared.APIResponse{StatusCode: http.StatusBadRequest, Error: err.Error()})
		}

		fmt.Println(req.Amount)

		result := s.svc.NewHistoryTopUp(req, decode)
		if result.StatusCode != http.StatusOK {
			return shared.WriteJSON(w, result.StatusCode, shared.APIResponse{StatusCode: result.StatusCode, Error: result.Error})
		}

		return shared.WriteJSON(w, result.StatusCode, shared.APIResponse{StatusCode: result.StatusCode, Message: "succesfully topup"})
	} else {
		return shared.WriteJSON(w, http.StatusBadRequest, shared.APIResponse{StatusCode: http.StatusBadRequest, Error: fmt.Errorf("Method not allowedd").Error()})
	}
}
