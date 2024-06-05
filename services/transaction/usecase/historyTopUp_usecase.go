package usecase

import (
	"context"
	"net/http"
	"strconv"

	"github.com/syafiqparadisam/paymentku/services/transaction/config"
	"github.com/syafiqparadisam/paymentku/services/transaction/domain"
	"github.com/syafiqparadisam/paymentku/services/transaction/dto"
	"github.com/syafiqparadisam/paymentku/services/transaction/errors"
)

func (u *Usecase) InsertHistoryTopUp(ctx context.Context, payload *dto.TopUpRequest, user *dto.XUserData) dto.APIResponse[interface{}] {
	log := config.Log()
	if payload.Amount <= 0 {
		response := dto.APIResponse[interface{}]{StatusCode: 400, Message: errors.ErrAmountIsLessThanZero.Error()}
		log.Info().Int("Status Code", response.StatusCode).Str("Message", response.Message).Msg("Response logs")
		return response
	}
	// update balance and find user
	userid, _ := strconv.Atoi(user.UserId)
	tx, errTx := u.TopUpRepo.StartTransaction(ctx)
	if errTx != nil {
		panic(errTx)
	}

	balance, err := u.TopUpRepo.FindBalanceById(tx, ctx, userid)
	if err != nil {
		panic(err)
	}

	err = u.TopUpRepo.IncreaseBalanceById(tx, ctx, payload.Amount, userid)
	if err != nil {
		tx.Rollback()
		topUpInfo := domain.NewHistoryTopUp(payload.Amount, balance.Balance, balance.Balance, "FAILED", userid)
		errInsertHistory := u.TopUpRepo.CreateTopUpHistory(ctx, topUpInfo)
		if errInsertHistory != nil {
			panic(errInsertHistory)
		}
		panic(err)
	}

	if err := tx.Commit(); err != nil {
		panic(err)
	}

	topUpInfo := domain.NewHistoryTopUp(payload.Amount, balance.Balance+int64(payload.Amount), balance.Balance, "SUCCESS", userid)
	errInsertHistory := u.TopUpRepo.CreateTopUpHistory(ctx, topUpInfo)
	if errInsertHistory != nil {
		tx.Rollback()
		panic(errInsertHistory)
	}

	response := dto.APIResponse[interface{}]{StatusCode: http.StatusOK, Message: "Successfully topup"}
	log.Info().Int("Status Code", response.StatusCode).Interface("Data", response.Data).Str("Message", response.Message).Msg("Response logs")
	return response

}
