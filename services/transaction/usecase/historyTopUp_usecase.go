package usecase

import (
	"context"
	"fmt"
	"net/http"
	"strconv"

	"github.com/syafiqparadisam/paymentku/services/transaction/domain"
	"github.com/syafiqparadisam/paymentku/services/transaction/dto"
	"github.com/syafiqparadisam/paymentku/services/transaction/errors"
)

func (u *Usecase) InsertHistoryTopUp(ctx context.Context, payload *dto.TopUpRequest, user *dto.XUserData) dto.APIResponse[interface{}] {
	if payload.Amount <= 0 {
		return dto.APIResponse[interface{}]{StatusCode: 400, Message: errors.ErrAmountIsLessThanZero.Error()}
	}
	// update balance and find user
	userid, _ := strconv.Atoi(user.UserId)
	fmt.Println("angell")
	tx, errTx := u.TopUpRepo.StartTransaction(ctx)
	if errTx != nil {
		panic(errTx)
	}
	balance, err := u.TopUpRepo.FindBalanceById(tx, ctx, userid)
	if err != nil {
		panic(err)
	}
	fmt.Println("oposehsuu")
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
	fmt.Println("haduhhh")
	// insert history info
	// ctxCreateHtory := context.TODO()
	fmt.Println("lahhh")
	if err := tx.Commit(); err != nil {
		fmt.Println("eror commit", err)
		panic(err)
	}
	topUpInfo := domain.NewHistoryTopUp(payload.Amount, balance.Balance+int64(payload.Amount), balance.Balance, "SUCCESS", userid)
	errInsertHistory := u.TopUpRepo.CreateTopUpHistory(ctx, topUpInfo)
	if errInsertHistory != nil {
		tx.Rollback()
		panic(errInsertHistory)
	}

	return dto.APIResponse[interface{}]{StatusCode: http.StatusOK, Message: "Successfully topup"}
}
