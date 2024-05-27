package usecase

import (
	"context"
	"database/sql"
	"net/http"
	"strconv"
	"time"

	"github.com/syafiqparadisam/paymentku/services/transaction/domain"
	"github.com/syafiqparadisam/paymentku/services/transaction/dto"
	"github.com/syafiqparadisam/paymentku/services/transaction/errors"
)

func (u *Usecase) InsertHistoryTransfer(payload *dto.TransferRequest, user *dto.XUserData) dto.APIResponse[interface{}] {
	userid, _ := strconv.Atoi(user.UserId)
	ctxTransfer, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	ctxTransferCreateHistory := context.TODO()
	defer cancel()
	tx, err := u.TransferRepo.StartTransaction(ctxTransfer)
	if err != nil {
		panic(err)
	}
	// find balance user and check transfer amount is greater than balance?
	foundSender, errFoundSender := u.TransferRepo.FindUsersById(tx, ctxTransfer, userid)
	if errFoundSender != nil {
		panic(errFoundSender)
	}
	if foundSender.Balance < int64(payload.Amount) {
		return dto.APIResponse[interface{}]{StatusCode: http.StatusBadRequest, Message: errors.ErrInsufficientBalance.Error()}
	}
	if payload.AccountNumber == foundSender.AccountNumber {
		return dto.APIResponse[interface{}]{StatusCode: http.StatusBadRequest, Message: errors.ErrTransferWithSameAccount.Error()}
	}
	foundReceiver, errFoundReceiver := u.TransferRepo.FindUserByAccNum(tx, ctxTransfer, payload.AccountNumber)
	if errFoundReceiver == sql.ErrNoRows {
		return dto.APIResponse[interface{}]{StatusCode: http.StatusBadRequest, Message: errors.ErrUserNoRows.Error()}
	}
	if errFoundReceiver != nil {
		panic(errFoundReceiver)
	}

	errDecreaseBalance := u.TransferRepo.DecreaseBalanceById(tx, ctxTransfer, payload.Amount, userid)
	if errDecreaseBalance != nil {
		tx.Rollback()
		transferInfo := domain.NewHistoryTransfer(userid, foundSender.User, foundSender.Name, foundReceiver.User, foundReceiver.Name, "FAILED", payload.Notes, payload.Amount, foundSender.Balance, foundSender.Balance)
		// insert to mongodb transfer
		errInsertHistory := u.TransferRepo.InsertTransferHistory(ctxTransferCreateHistory, transferInfo)
		if errInsertHistory != nil {
			tx.Rollback()
			panic(errInsertHistory)
		}
		panic(errDecreaseBalance)
	}
	errIncreaseBalance := u.TransferRepo.IncreaseBalanceByAccNumber(tx, ctxTransfer, payload.Amount, payload.AccountNumber)
	if errIncreaseBalance != nil {
		tx.Rollback()

		transferInfo := domain.NewHistoryTransfer(userid, foundSender.User, foundSender.Name, foundReceiver.User, foundReceiver.Name, "FAILED", payload.Notes, payload.Amount, foundSender.Balance, foundSender.Balance)
		errInsertHistory := u.TransferRepo.InsertTransferHistory(ctxTransferCreateHistory, transferInfo)
		if errInsertHistory != nil {
			tx.Rollback()
			panic(errInsertHistory)
		}
		panic(errIncreaseBalance)
	}
	transferInfo := domain.NewHistoryTransfer(userid, foundSender.User, foundSender.Name, foundReceiver.User, foundReceiver.Name, "SUCCESS", payload.Notes, payload.Amount, foundSender.Balance, foundSender.Balance-int64(payload.Amount))
	// insert to mongodb transfer

	errInsertHistory := u.TransferRepo.InsertTransferHistory(ctxTransferCreateHistory, transferInfo)
	if errInsertHistory != nil {
		tx.Rollback()
		panic(errInsertHistory)
	}
	
	// insert notification to receiver
	notification := domain.NewNotification(foundReceiver.Id, transferInfo, foundReceiver)
	errInsertNotification := u.TransferRepo.InsertToNotification(tx, ctxTransfer, notification)
	if errInsertNotification != nil {
		tx.Rollback()
		transferInfo := domain.NewHistoryTransfer(userid, foundSender.User, foundSender.Name, foundReceiver.User, foundReceiver.Name, "FAILED", payload.Notes, payload.Amount, foundSender.Balance, foundSender.Balance)
		errInsertHistory := u.TransferRepo.InsertTransferHistory(ctxTransferCreateHistory, transferInfo)
		if errInsertHistory != nil {
			tx.Rollback()
			panic(errInsertHistory)
		}
		panic(errInsertNotification)
	}

	if errCommit := tx.Commit(); errCommit != nil {
		panic(errCommit)
	}

	if ctxTransfer.Err() == context.DeadlineExceeded {
		// Konteks telah melampaui batas waktu
		// Lakukan tindakan yang sesuai, seperti mengembalikan status 500
		return dto.APIResponse[interface{}]{StatusCode: http.StatusInternalServerError, Message: errors.ErrServer.Error()}
	}
	return dto.APIResponse[interface{}]{StatusCode: 200, Data: nil, Message: "Successfully transfer"}
}
