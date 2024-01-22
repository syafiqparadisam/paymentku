package services

import (
	"net/http"

	"github.com/syafiqparadisam/paymentku/domain/transaction/dto"
	"github.com/syafiqparadisam/paymentku/shared"
)

func (s *Service) FindAccount(dto *dto.FindUserRequest) shared.APIResponse {
	// find user by account number
	user, err := s.Sql.FindUserAndEmailByAccNumber(dto.AccountNumber)
	if err != nil {
		return shared.APIResponse{StatusCode: http.StatusBadRequest, Error: err.Error()}
	}
	return shared.APIResponse{StatusCode: http.StatusOK, Data: user, Message: "Ok"}
}
