package usecase

import (
	"context"
	"database/sql"
	"net/http"
	"strconv"

	"github.com/syafiqparadisam/paymentku/services/transaction/config"
	"github.com/syafiqparadisam/paymentku/services/transaction/domain"
	"github.com/syafiqparadisam/paymentku/services/transaction/dto"
	"github.com/syafiqparadisam/paymentku/services/transaction/errors"
)

func (u *Usecase) InsertHistoryTransfer(ctx context.Context, payload *dto.TransferRequest, user *dto.XUserData) dto.APIResponse[interface{}] {
	log := config.Log()
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
		response := dto.APIResponse[interface{}]{StatusCode: http.StatusBadRequest, Message: errors.ErrInsufficientBalance.Error()}
		log.Info().Int("Status Code", response.StatusCode).Str("Message", response.Message).Msg("Response logs")
		return response
	}
	if payload.AccountNumber == foundSender.AccountNumber {
		response := dto.APIResponse[interface{}]{StatusCode: http.StatusBadRequest, Message: errors.ErrTransferWithSameAccount.Error()}
		log.Info().Int("Status Code", response.StatusCode).Str("Message", response.Message).Msg("Response logs")
		return response
	}
	foundReceiver, errFoundReceiver := u.TransferRepo.FindUserByAccNum(tx, ctx, payload.AccountNumber)
	if errFoundReceiver == sql.ErrNoRows {
		response := dto.APIResponse[interface{}]{StatusCode: http.StatusBadRequest, Message: errors.ErrUserNoRows.Error()}
		log.Info().Int("Status Code", response.StatusCode).Str("Message", response.Message).Msg("Response logs")
		return response
	}
	if errFoundReceiver != nil {
		panic(errFoundReceiver)
	}

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

	if errCommit := tx.Commit(); errCommit != nil {
		panic(errCommit)
	}

	transferInfo := domain.NewHistoryTransfer(userid, foundSender.User, foundSender.Name, foundReceiver.User, foundReceiver.Name, "SUCCESS", payload.Notes, payload.Amount, foundSender.Balance, foundSender.Balance-int64(payload.Amount))
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

	response := dto.APIResponse[interface{}]{StatusCode: 200, Data: nil, Message: "Successfully transfer"}
	log.Info().Int("Status Code", response.StatusCode).Interface("Data", response.Data).Str("Message", response.Message).Msg("Response logs")
	return response
}
