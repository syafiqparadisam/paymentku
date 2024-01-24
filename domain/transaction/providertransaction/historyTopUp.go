package providertransaction

import (
	"fmt"
	"net/http"

	"github.com/syafiqparadisam/paymentku/domain/transaction/dtotransaction"
	"github.com/syafiqparadisam/paymentku/domain/transaction/mongotransaction"
	"github.com/syafiqparadisam/paymentku/domain/transaction/mysqltransaction"
	"github.com/syafiqparadisam/paymentku/entity"
	"github.com/syafiqparadisam/paymentku/shared"
)

func (s *Provider) NewHistoryTopUp(dto *dtotransaction.TopUpRequest, decode *shared.UserJwtDecode) shared.APIResponse {

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

func createTopUpInfo(dto dtotransaction.TopUpRequest, balance *mysqltransaction.UserIdAndBalance) *mongotransaction.TopUpInfo {
	return &mongotransaction.TopUpInfo{
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
