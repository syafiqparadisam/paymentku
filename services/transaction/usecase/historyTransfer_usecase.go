package usecase

import (
	"context"
	"database/sql"
	"fmt"
	"net/http"
	"strconv"

	"github.com/syafiqparadisam/paymentku/services/transaction/domain"
	"github.com/syafiqparadisam/paymentku/services/transaction/dto"
	"github.com/syafiqparadisam/paymentku/services/transaction/errors"
)

func (u *Usecase) InsertHistoryTransfer(ctx context.Context, payload *dto.TransferRequest, user *dto.XUserData) dto.APIResponse[interface{}] {
	userid, _ := strconv.Atoi(user.UserId)

	tx, err := u.TransferRepo.StartTransaction(ctx)
	if err != nil {
		panic(err)
	}
	// find balance user and check transfer amount is greater than balance?
	foundSender, errFoundSender := u.TransferRepo.FindUsersById(tx, ctx, userid)
	if errFoundSender != nil {
		panic(errFoundSender)
	}
	if foundSender.Balance < int64(payload.Amount) {
		return dto.APIResponse[interface{}]{StatusCode: http.StatusBadRequest, Message: errors.ErrInsufficientBalance.Error()}
	}
	if payload.AccountNumber == foundSender.AccountNumber {
		return dto.APIResponse[interface{}]{StatusCode: http.StatusBadRequest, Message: errors.ErrTransferWithSameAccount.Error()}
	}
	foundReceiver, errFoundReceiver := u.TransferRepo.FindUserByAccNum(tx, ctx, payload.AccountNumber)
	if errFoundReceiver == sql.ErrNoRows {
		return dto.APIResponse[interface{}]{StatusCode: http.StatusBadRequest, Message: errors.ErrUserNoRows.Error()}
	}
	if errFoundReceiver != nil {
		panic(errFoundReceiver)
	}

	fmt.Println("haii")
	errDecreaseBalance := u.TransferRepo.DecreaseBalanceById(tx, ctx, payload.Amount, userid)
	if errDecreaseBalance != nil {
		tx.Rollback()
		transferInfo := domain.NewHistoryTransfer(userid, foundSender.User, foundSender.Name, foundReceiver.User, foundReceiver.Name, "FAILED", payload.Notes, payload.Amount, foundSender.Balance, foundSender.Balance)
		// insert to mongodb transfer
		errInsertHistory := u.TransferRepo.InsertTransferHistory(ctx, transferInfo)
		if errInsertHistory != nil {
			panic(errInsertHistory)
		}
		panic(errDecreaseBalance)
	}

	fmt.Println("haii3")
	errIncreaseBalance := u.TransferRepo.IncreaseBalanceByAccNumber(tx, ctx, payload.Amount, payload.AccountNumber)
	if errIncreaseBalance != nil {
		tx.Rollback()

		transferInfo := domain.NewHistoryTransfer(userid, foundSender.User, foundSender.Name, foundReceiver.User, foundReceiver.Name, "FAILED", payload.Notes, payload.Amount, foundSender.Balance, foundSender.Balance)
		errInsertHistory := u.TransferRepo.InsertTransferHistory(ctx, transferInfo)
		if errInsertHistory != nil {
			panic(errInsertHistory)
		}
		panic(errIncreaseBalance)
	}

	fmt.Println("okee")
	if errCommit := tx.Commit(); errCommit != nil {
		panic(errCommit)
	}
	
	transferInfo := domain.NewHistoryTransfer(userid, foundSender.User, foundSender.Name, foundReceiver.User, foundReceiver.Name, "SUCCESS", payload.Notes, payload.Amount, foundSender.Balance, foundSender.Balance-int64(payload.Amount))
	fmt.Println("haii 4")
	errInsertHistory := u.TransferRepo.InsertTransferHistory(ctx, transferInfo)
	if errInsertHistory != nil {
		tx.Rollback()
		panic(errInsertHistory)
	}
	// insert notification to receiver
	notification := domain.NewNotification(foundReceiver.Id, transferInfo, foundReceiver)
	errInsertNotification := u.TransferRepo.InsertToNotification(ctx, notification)

	if errInsertNotification != nil {
		transferInfo := domain.NewHistoryTransfer(userid, foundSender.User, foundSender.Name, foundReceiver.User, foundReceiver.Name, "FAILED", payload.Notes, payload.Amount, foundSender.Balance, foundSender.Balance)
		errInsertHistory := u.TransferRepo.InsertTransferHistory(ctx, transferInfo)
		if errInsertHistory != nil {
			panic(errInsertHistory)
		}
		panic(errInsertNotification)
	}

	return dto.APIResponse[interface{}]{StatusCode: 200, Data: nil, Message: "Successfully transfer"}
}
