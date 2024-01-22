package services

import (
	"fmt"
	"net/http"

	"github.com/syafiqparadisam/paymentku/domain/transaction/dto"
	"github.com/syafiqparadisam/paymentku/domain/transaction/mongodbrepo"
	"github.com/syafiqparadisam/paymentku/domain/transaction/mysqlrepo"
	"github.com/syafiqparadisam/paymentku/entity"
	"github.com/syafiqparadisam/paymentku/shared"
)

func (s *Service) NewHistoryTopUp(dto *dto.TopUpRequest, decode *shared.UserJwtDecode) shared.APIResponse {

	// update balance and find user
	errIncreaseBalance := s.Sql.IncreaseBalanceByNameAndEmail(dto.Amount, decode.User, decode.Email)
	fmt.Println(errIncreaseBalance)
	if errIncreaseBalance != nil {
		return shared.APIResponse{StatusCode: http.StatusBadRequest, Error: errIncreaseBalance.Error()}
	}

	balance, errFindBalance := s.Sql.FindBalanceByName(decode.User)
	if errFindBalance != nil {
		return shared.APIResponse{StatusCode: http.StatusBadRequest, Error: errFindBalance.Error()}
	}
	// insert history info
	topUpInfo := createTopUpInfo(*dto, balance)
	errInsertHistory := s.TopUp.InsertTopUpHistory(topUpInfo)
	if errInsertHistory != nil {
		return shared.APIResponse{StatusCode: http.StatusBadRequest, Error: errInsertHistory.Error()}
	}

	fmt.Println("sudah terkirim")

	return shared.APIResponse{StatusCode: http.StatusOK, Message: "succesfully topup"}

}

func createTopUpInfo(dto dto.TopUpRequest, balance *mysqlrepo.UserIdAndBalance) *mongodbrepo.TopUpInfo {
	return &mongodbrepo.TopUpInfo{
		History: &entity.History{
			UserId:    balance.UserId,
			Amount:    dto.Amount,
			CreatedAt: NewCreatedAt(),
			IsRead:    false,
		},
		Dto: dto,
		LastMoney: &entity.MoneyBefore{
			Before: balance.Balance,
		},
		Balance: &entity.Bank{
			Balance: balance.Balance + uint64(dto.Amount),
		},
	}
}
