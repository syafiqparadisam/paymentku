package usecase

import (
	"context"

	"github.com/syafiqparadisam/paymentku/services/transactional/domain"
	"github.com/syafiqparadisam/paymentku/services/transactional/dto"
	topup_repo "github.com/syafiqparadisam/paymentku/services/transactional/repository/topup"
	transfer_repo "github.com/syafiqparadisam/paymentku/services/transactional/repository/transfer"
)

type Usecase struct {
	tfRepo    transfer_repo.TransferInterface
	topUpRepo topup_repo.TopUpInterface
}

type UsecaseInterface interface {
	GetAllHistoryTopUp(ctx context.Context, user *dto.XUserData) dto.APIResponse[*[]domain.GetHistoryTopUpForGetAll]
	GetAllHistoryTransfer(ctx context.Context, user *dto.XUserData) dto.APIResponse[*[]domain.GetHistoryTransfers]
	GetHistoryTransferById(ctx context.Context, user *dto.XUserData, id int) dto.APIResponse[*domain.GetHistoryTransferById]
	GetHistoryTopUpById(ctx context.Context, user *dto.XUserData, id int) dto.APIResponse[*domain.GetHistoryTopUpById]
	DeleteAllHistoryTopUp(ctx context.Context, user *dto.XUserData) dto.APIResponse[interface{}]
	DeleteHistoryTopUpById(ctx context.Context, user *dto.XUserData, id int) dto.APIResponse[interface{}]
	DeleteHistoryTransferById(ctx context.Context, user *dto.XUserData, id int) dto.APIResponse[interface{}]
	DeleteAllHistoryTransfer(ctx context.Context, user *dto.XUserData) dto.APIResponse[interface{}]
	InsertHistoryTransfer(ctx context.Context, payload *dto.TransferRequest, user *dto.XUserData) dto.APIResponse[interface{}]
	InsertHistoryTopUp(ctx context.Context, payload *dto.TopUpRequest, user *dto.XUserData) dto.APIResponse[interface{}]
}

func NewTransactionalUsecase(tf transfer_repo.TransferInterface, topup topup_repo.TopUpInterface) *Usecase {
	return &Usecase{tfRepo: tf, topUpRepo: topup}
}
