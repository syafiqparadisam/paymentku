package usecase

import (
	"context"
	"database/sql"
	"net/http"
	"strconv"

	"github.com/syafiqparadisam/paymentku/services/history/config"
	"github.com/syafiqparadisam/paymentku/services/history/domain"
	"github.com/syafiqparadisam/paymentku/services/history/dto"
	"github.com/syafiqparadisam/paymentku/services/history/errors"
)

func (u *Usecase) DeleteHistoryTransferById(ctx context.Context, user *dto.XUserData, id int) dto.APIResponse[interface{}] {
	log := config.Log()
	userid, _ := strconv.Atoi(user.UserId)

	tx, err := u.tfRepo.StartACID(ctx)
	if err != nil {
		panic(err)
	}
	// delete history
	errDelete := u.tfRepo.DeleteHistoryTransferById(tx, ctx, id, userid)
	if errDelete == errors.ErrNothingToDel {
		response := dto.APIResponse[interface{}]{StatusCode: 200, Message: errors.ErrNothingToDel.Error()}
		log.Info().Int("Status Code", response.StatusCode).Str("Message", response.Message)
		return response
	}
	if errDelete != nil {
		tx.Rollback()
		panic(errDelete)
	}
	if err := tx.Commit(); err != nil {
		panic(err)
	}
	response := dto.APIResponse[interface{}]{StatusCode: 200, Message: "Successfully deleted"}
	log.Info().Int("Status Code", response.StatusCode).Str("Message", response.Message)
	return response
}

func (u *Usecase) DeleteAllHistoryTransfer(ctx context.Context, user *dto.XUserData) dto.APIResponse[interface{}] {
	log := config.Log()
	userid, _ := strconv.Atoi(user.UserId)
	// find account by id
	tx, err := u.tfRepo.StartACID(ctx)
	if err != nil {
		panic(err)
	}

	// delete history
	errDeleteHistory := u.tfRepo.DeleteAllHistoryTransfer(tx, ctx, userid)
	if errDeleteHistory == errors.ErrNothingToDel {
		response := dto.APIResponse[interface{}]{StatusCode: http.StatusOK, Message: errors.ErrNothingToDel.Error()}
		log.Info().Int("Status Code", response.StatusCode).Str("Message", response.Message)
		return response
	}
	if errDeleteHistory != nil {
		tx.Rollback()
		panic(errDeleteHistory)
	}
	if err := tx.Commit(); err != nil {
		panic(err)
	}

	response := dto.APIResponse[interface{}]{StatusCode: http.StatusOK, Message: "Successfully deleted"}
	log.Info().Int("Status Code", response.StatusCode).Str("Message", response.Message)
	return response
}

func (u *Usecase) GetAllHistoryTransfer(ctx context.Context, user *dto.XUserData) dto.APIResponse[*[]domain.HistoryTransferForGetAll] {
	log := config.Log()
	userid, _ := strconv.Atoi(user.UserId)
	// find account by id

	data, errFind := u.tfRepo.GetAllHistoryTransfer(ctx, userid)

	if errFind != nil {
		panic(errFind)
	}
	response := dto.APIResponse[*[]domain.HistoryTransferForGetAll]{StatusCode: 200, Data: data, Message: "Ok"}
	log.Info().Int("Status Code", response.StatusCode).Interface("Data", response.Data).Str("Message", response.Message)
	return response
}

func (u *Usecase) GetHistoryTransferById(ctx context.Context, user *dto.XUserData, id int) dto.APIResponse[*domain.HistoryTransfer] {
	log := config.Log()
	userid, _ := strconv.Atoi(user.UserId)
	// find account by id

	isRead, errFind := u.tfRepo.FindIsRead(ctx, id)
	if errFind == sql.ErrNoRows {
		response := dto.APIResponse[*domain.HistoryTransfer]{StatusCode: 404, Message: errors.ErrHistoryNoRows.Error()}
		log.Info().Int("Status Code", response.StatusCode).Str("Message", response.Message)
		return response
	}
	if errFind != nil {
		panic(errFind)
	}

	if isRead.IsRead == 0 {
		// update isread
		errUpdate := u.tfRepo.UpdateIsRead(ctx, id)
		if errUpdate != nil {
			panic(errUpdate)
		}
	}
	data, errFind := u.tfRepo.GetHistoryTransferById(ctx, id, userid)
	if errFind == sql.ErrNoRows {
		response := dto.APIResponse[*domain.HistoryTransfer]{StatusCode: 404, Message: errors.ErrHistoryNoRows.Error()}
		log.Info().Int("Status Code", response.StatusCode).Str("Message", response.Message)
		return response
	}
	if errFind != nil {
		panic(errFind)
	}
	response := dto.APIResponse[*domain.HistoryTransfer]{StatusCode: 200, Data: data, Message: "Ok"}
	log.Info().Int("Status Code", response.StatusCode).Interface("Data", response.Data).Str("Message", response.Message)
	return response
}
