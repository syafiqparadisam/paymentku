package usecase

import (
	"context"

	"github.com/syafiqparadisam/paymentku/services/transactional/domain"
	"github.com/syafiqparadisam/paymentku/services/transactional/dto"
	history_repo "github.com/syafiqparadisam/paymentku/services/transactional/repository/history"
)

type Usecase struct {
	tfRepo    history_repo.TransferInterface
	topUpRepo history_repo.TopUpInterface
}

type UsecaseInterface interface {
	GetAllHistoryTopUp(ctx context.Context, user *dto.XUserData) dto.APIResponse[*[]domain.HistoryTopUpForGetAll]
	GetAllHistoryTransfer(ctx context.Context, user *dto.XUserData) dto.APIResponse[*[]domain.HistoryTransferForGetAll]
	GetHistoryTransferById(ctx context.Context, user *dto.XUserData, id int) dto.APIResponse[*domain.HistoryTransfer]
	GetHistoryTopUpById(ctx context.Context, user *dto.XUserData, id int) dto.APIResponse[*domain.HistoryTopUp]
	DeleteAllHistoryTopUp(ctx context.Context, user *dto.XUserData) dto.APIResponse[interface{}]
	DeleteHistoryTopUpById(ctx context.Context, user *dto.XUserData, id int) dto.APIResponse[interface{}]
	DeleteHistoryTransferById(ctx context.Context, user *dto.XUserData, id int) dto.APIResponse[interface{}]
	DeleteAllHistoryTransfer(ctx context.Context, user *dto.XUserData) dto.APIResponse[interface{}]
	InsertHistoryTransfer(ctx context.Context, payload *dto.TransferRequest, user *dto.XUserData) dto.APIResponse[interface{}]
	InsertHistoryTopUp(ctx context.Context, payload *dto.TopUpRequest, user *dto.XUserData) dto.APIResponse[interface{}]
}

func NewTransactionalUsecase(tf transactional_repo.TransferInterface, topup transactional_repo.TopUpInterface) *Usecase {
	return &Usecase{tfRepo: tf, topUpRepo: topup}
}
