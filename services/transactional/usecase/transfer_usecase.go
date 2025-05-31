package usecase

import (
	"context"
	"database/sql"
	"net/http"
	"strconv"

	"github.com/google/uuid"
	"github.com/syafiqparadisam/paymentku/services/transactional/config"
	"github.com/syafiqparadisam/paymentku/services/transactional/domain"
	"github.com/syafiqparadisam/paymentku/services/transactional/dto"
	"github.com/syafiqparadisam/paymentku/services/transactional/errors"
)

func (u *Usecase) InsertHistoryTransfer(ctx context.Context, payload *dto.TransferRequest, user *dto.XUserData) dto.APIResponse[interface{}] {
	log := config.Log()
	userid, _ := strconv.Atoi(user.UserId)

	tx, err := u.tfRepo.StartTransaction(ctx)
	if err != nil {
		panic(err)
	}
	// find balance user and check transfer amount is greater than balance?
	foundSender, errFoundSender := u.tfRepo.FindUsersById(tx, ctx, userid)
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
	foundReceiver, errFoundReceiver := u.tfRepo.FindUserByAccNum(tx, ctx, payload.AccountNumber)
	if errFoundReceiver == sql.ErrNoRows {
		response := dto.APIResponse[interface{}]{StatusCode: http.StatusBadRequest, Message: errors.ErrUserNoRows.Error()}
		log.Info().Int("Status Code", response.StatusCode).Str("Message", response.Message).Msg("Response logs")
		return response
	}
	if errFoundReceiver != nil {
		panic(errFoundReceiver)
	}

	errDecreaseBalance := u.tfRepo.DecreaseBalanceById(tx, ctx, payload.Amount, userid)
	if errDecreaseBalance != nil {
		tx.Rollback()
		transferInfo := domain.NewHistoryTransfer(userid, foundSender.User, foundSender.Name, foundReceiver.User, foundReceiver.Name, "FAILED", payload.Notes, payload.Amount, foundSender.Balance, foundSender.Balance)
		// insert to mongodb transfer
		errInsertHistory := u.tfRepo.InsertTransferHistory(ctx, transferInfo)
		if errInsertHistory != nil {
			panic(errInsertHistory)
		}
		panic(errDecreaseBalance)
	}
	lockKey := uuid.New().String()
	u.topUpRepo.DeleteUserCache(userid, lockKey)

	errIncreaseBalance := u.tfRepo.IncreaseBalanceByAccNumber(tx, ctx, payload.Amount, payload.AccountNumber)
	if errIncreaseBalance != nil {
		tx.Rollback()

		transferInfo := domain.NewHistoryTransfer(userid, foundSender.User, foundSender.Name, foundReceiver.User, foundReceiver.Name, "FAILED", payload.Notes, payload.Amount, foundSender.Balance, foundSender.Balance)
		errInsertHistory := u.tfRepo.InsertTransferHistory(ctx, transferInfo)
		if errInsertHistory != nil {
			panic(errInsertHistory)
		}
		panic(errIncreaseBalance)
	}
	
	lockKey2 := uuid.New().String()
	u.topUpRepo.DeleteUserCache(foundReceiver.Id, lockKey2)

	if errCommit := tx.Commit(); errCommit != nil {
		panic(errCommit)
	}

	transferInfo := domain.NewHistoryTransfer(userid, foundSender.User, foundSender.Name, foundReceiver.User, foundReceiver.Name, "SUCCESS", payload.Notes, payload.Amount, foundSender.Balance, foundSender.Balance-int64(payload.Amount))
	errInsertHistory := u.tfRepo.InsertTransferHistory(ctx, transferInfo)
	if errInsertHistory != nil {
		tx.Rollback()
		panic(errInsertHistory)
	}
	// insert notification to receiver
	notification := domain.NewNotification(foundReceiver.Id, transferInfo, foundReceiver)
	errInsertNotification := u.tfRepo.InsertToNotification(ctx, notification)

	if errInsertNotification != nil {
		transferInfo := domain.NewHistoryTransfer(userid, foundSender.User, foundSender.Name, foundReceiver.User, foundReceiver.Name, "FAILED", payload.Notes, payload.Amount, foundSender.Balance, foundSender.Balance)
		errInsertHistory := u.tfRepo.InsertTransferHistory(ctx, transferInfo)
		if errInsertHistory != nil {
			panic(errInsertHistory)
		}
		panic(errInsertNotification)
	}

	response := dto.APIResponse[interface{}]{StatusCode: 200, Message: "Successfully transfer"}
	log.Info().Int("Status Code", response.StatusCode).Str("Message", response.Message).Msg("Response logs")
	return response
}
