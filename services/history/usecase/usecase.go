package usecase

import (
	"github.com/syafiqparadisam/paymentku/services/history/domain"
	"github.com/syafiqparadisam/paymentku/services/history/dto"
	history_repo "github.com/syafiqparadisam/paymentku/services/history/repository/history"
)

type Usecase struct {
	tfRepo    history_repo.TransferInterface
	topUpRepo history_repo.TopUpInterface
}

type UsecaseInterface interface {
	GetAllHistoryTopUp(user *dto.XUserData) dto.APIResponse[*[]domain.HistoryTopUpForGetAll]
	GetAllHistoryTransfer(user *dto.XUserData) dto.APIResponse[*[]domain.HistoryTransferForGetAll]
	GetHistoryTransferById(user *dto.XUserData, id int) dto.APIResponse[*domain.HistoryTransfer]
	GetHistoryTopUpById(user *dto.XUserData, id int) dto.APIResponse[*domain.HistoryTopUp]
	DeleteAllHistoryTopUp(user *dto.XUserData) dto.APIResponse[interface{}]
	DeleteHistoryTopUpById(user *dto.XUserData, id int) dto.APIResponse[interface{}]
	DeleteHistoryTransferById(user *dto.XUserData, id int) dto.APIResponse[interface{}]
	DeleteAllHistoryTransfer(user *dto.XUserData) dto.APIResponse[interface{}]
}

func NewHistoryUsecase(tf history_repo.TransferInterface, topup history_repo.TopUpInterface) *Usecase {
	return &Usecase{tfRepo: tf, topUpRepo: topup}
}
