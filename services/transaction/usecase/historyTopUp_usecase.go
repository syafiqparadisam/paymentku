package usecase

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"github.com/syafiqparadisam/paymentku/services/transaction/domain"
	"github.com/syafiqparadisam/paymentku/services/transaction/dto"
	"github.com/syafiqparadisam/paymentku/services/transaction/errors"
)


func (u *Usecase) InsertHistoryTopUp(payload *dto.TopUpRequest, user *dto.XUserData) dto.APIResponse[interface{}] {
	if payload.Amount <= 0 {
		return dto.APIResponse[interface{}]{StatusCode: 400, Message: errors.ErrAmountIsLessThanZero.Error()}
	}
	// update balance and find user
	userid, _ := strconv.Atoi(user.UserId)
	ctxTopUp, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	tx, errTx := u.TopUpRepo.StartTransaction(ctxTopUp)
	if errTx != nil {
		panic(errTx)
	}
	balance, err := u.TopUpRepo.FindBalanceById(tx, ctxTopUp, userid)
	if err != nil {
		panic(err)
	}

	err = u.TopUpRepo.IncreaseBalanceById(tx, ctxTopUp, payload.Amount, userid)
	if err != nil {
		tx.Rollback()
		topUpInfo := domain.NewHistoryTopUp(payload.Amount, balance.Balance, balance.Balance, "FAILED", userid)
		errInsertHistory := u.TopUpRepo.CreateTopUpHistory(ctxTopUp, topUpInfo)
		if errInsertHistory != nil {
			panic(errInsertHistory)
		}
		panic(err)
	}
	// insert history info
	topUpInfo := domain.NewHistoryTopUp(payload.Amount, balance.Balance+int64(payload.Amount), balance.Balance, "SUCCESS", userid)
	errInsertHistory := u.TopUpRepo.CreateTopUpHistory(ctxTopUp, topUpInfo)
	if errInsertHistory != nil {
		tx.Rollback()
		panic(errInsertHistory)
	}
	if err := tx.Commit(); err != nil {
		panic(err)
	}

	return dto.APIResponse[interface{}]{StatusCode: http.StatusOK, Message: "Successfully topup"}
}
