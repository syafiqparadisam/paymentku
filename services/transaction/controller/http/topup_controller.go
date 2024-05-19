package controllerhttp

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/syafiqparadisam/paymentku/services/transaction/dto"
)

func (s *ControllerHTTP) HandlerTopUp(w http.ResponseWriter, r *http.Request, user *dto.XUserData) error {
	topUpReq := &dto.TopUpRequest{}
	fmt.Println("heerer")
	if err := json.NewDecoder(r.Body).Decode(topUpReq); err != nil {
		return WriteJSON(w, http.StatusBadRequest, dto.APIResponse[interface{}]{StatusCode: http.StatusBadRequest, Message: "Invalid input format"})
	}
	fmt.Println(topUpReq.Amount)

	result := s.usecase.InsertHistoryTopUp(topUpReq, user)
	if result.StatusCode != http.StatusOK {
		return WriteJSON(w, result.StatusCode, result)
	}

	return WriteJSON(w, result.StatusCode, dto.APIResponse[interface{}]{StatusCode: result.StatusCode, Message: "succesfully topup"})

}
