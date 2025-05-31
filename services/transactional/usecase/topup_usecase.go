package usecase

import (
	"context"
	"net/http"
	"strconv"

	"github.com/google/uuid"
	"github.com/syafiqparadisam/paymentku/services/transactional/config"
	"github.com/syafiqparadisam/paymentku/services/transactional/domain"
	"github.com/syafiqparadisam/paymentku/services/transactional/dto"
	"github.com/syafiqparadisam/paymentku/services/transactional/errors"
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
	tx, errTx := u.topUpRepo.StartTransaction(ctx)
	if errTx != nil {
		panic(errTx)
	}

	balance, err := u.topUpRepo.FindBalanceById(tx, ctx, userid)
	if err != nil {
		panic(err)
	}

	err = u.topUpRepo.IncreaseBalanceById(tx, ctx, payload.Amount, userid)
	if err != nil {
		tx.Rollback()
		topUpInfo := domain.NewHistoryTopUp(payload.Amount, balance.Balance, balance.Balance, "FAILED", userid)
		errInsertHistory := u.topUpRepo.CreateTopUpHistory(ctx, topUpInfo)
		if errInsertHistory != nil {
			panic(errInsertHistory)
		}
		panic(err)
	}

	if err := tx.Commit(); err != nil {
		panic(err)
	}

	lockKey := uuid.New().String()
	u.topUpRepo.DeleteUserCache(userid, lockKey)
	

	topUpInfo := domain.NewHistoryTopUp(payload.Amount, balance.Balance+int64(payload.Amount), balance.Balance, "SUCCESS", userid)
	errInsertHistory := u.topUpRepo.CreateTopUpHistory(ctx, topUpInfo)
	if errInsertHistory != nil {
		tx.Rollback()
		panic(errInsertHistory)
	}

	response := dto.APIResponse[interface{}]{StatusCode: http.StatusOK, Message: "Successfully topup"}
	log.Info().Int("Status Code", response.StatusCode).Interface("Data", response.Data).Str("Message", response.Message).Msg("Response logs")
	return response
}
