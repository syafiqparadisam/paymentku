package usecase

import (
	"context"

	"github.com/syafiqparadisam/paymentku/services/transaction/dto"
	transaction_repo "github.com/syafiqparadisam/paymentku/services/transaction/repository/transaction"
)

type Usecase struct {
	TransferRepo transaction_repo.TransferInterface
	TopUpRepo    transaction_repo.TopUpInterface
}

type UsecaseInterface interface {
	InsertHistoryTopUp(ctx context.Context,dto *dto.TopUpRequest, user *dto.XUserData) dto.APIResponse[interface{}]
	InsertHistoryTransfer(ctx context.Context,dto *dto.TransferRequest, user *dto.XUserData) dto.APIResponse[interface{}]
}

func NewTransactionUsecase(tfRepo transaction_repo.TransferInterface, topUpRepo transaction_repo.TopUpInterface) *Usecase {
	return &Usecase{TransferRepo: tfRepo, TopUpRepo: topUpRepo}
}
