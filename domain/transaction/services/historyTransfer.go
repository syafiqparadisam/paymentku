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

func (s *Service) NewHistoryTransfer(dto *dto.TransferRequest, decode *shared.UserJwtDecode) shared.APIResponse {

	// find balance user and check transfer amount is greater than balance?
	balance, finderr := s.Sql.FindBalanceByName(decode.User)
	fmt.Println("haruse wes terexecuted")
	if finderr != nil {
		return shared.APIResponse{StatusCode: http.StatusBadRequest, Error: finderr.Error()}
	}
	if balance.Balance < uint64(dto.Nominal) {
		return shared.APIResponse{StatusCode: http.StatusBadRequest, Error: fmt.Errorf("balance is under").Error()}
	}
	// check apakah dia transfer ke dirinya sendiri
	accNum, errFindAccNum := s.Sql.FindAccNumByName(decode.User)
	if errFindAccNum != nil {
		return shared.APIResponse{StatusCode: http.StatusBadRequest, Error: errFindAccNum.Error()}
	}
	if dto.AccountNumber == accNum.AccountNumber {
		return shared.APIResponse{StatusCode: http.StatusBadRequest, Error: fmt.Errorf("can't transfer to yourself").Error()}
	}
	// decrease balance from this user
	errDecreaseBalance := s.Sql.DecreaseBalanceByUser(dto.Nominal, decode.User)
	if errDecreaseBalance != nil {
		return shared.APIResponse{StatusCode: http.StatusBadRequest, Error: errDecreaseBalance.Error()}
	}
	// increaase balance user to by accountNumber
	errIncreaseBalance := s.Sql.IncreaseBalanceByAccNumber(dto.Nominal, dto.AccountNumber)
	if errIncreaseBalance != nil {
		return shared.APIResponse{StatusCode: http.StatusBadRequest, Error: errIncreaseBalance.Error()}
	}
	// find information user and accountNumber
	userAndAccNum, errFindNameAndAccNum := s.Sql.FindNameAccNumAndEmailByAccNum(dto.AccountNumber)
	if errFindNameAndAccNum != nil {
		return shared.APIResponse{StatusCode: http.StatusBadRequest, Error: errFindNameAndAccNum.Error()}
	}

	transferInfo := createTransferInfo(*dto, userAndAccNum, balance)
	// insert to mongodb transfer
	errInsertHistory := s.Transfer.InsertTransferHistory(transferInfo)
	if errInsertHistory != nil {
		return shared.APIResponse{StatusCode: http.StatusBadRequest, Error: errInsertHistory.Error()}
	}
	fmt.Println("success transfer")
	return shared.APIResponse{StatusCode: 200, Data: nil, Message: fmt.Sprintf("successfully transfer to %s", userAndAccNum.User)}
}

func createTransferInfo(dto dto.TransferRequest, userAndAccNum *mysqlrepo.UserAccNumAndEmail, balance *mysqlrepo.UserIdAndBalance) *mongodbrepo.TransferInfo {

	return &mongodbrepo.TransferInfo{
		History: &entity.History{
			UserId:    balance.UserId,
			Amount:    dto.Nominal,
			CreatedAt: NewCreatedAt(),
			IsRead:    false,
		},
		Destination: &entity.Destination{
			To:        userAndAccNum.User,
			ToAccount: userAndAccNum.AccountNumber,
		},
		Dto: dto,
		Money: &entity.MoneyAfter{
			After: balance.Balance - uint64(dto.Nominal),
		},
	}
}
