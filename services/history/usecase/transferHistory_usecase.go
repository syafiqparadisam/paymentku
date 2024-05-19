package usecase

import (
	"context"
	"database/sql"
	"net/http"
	"strconv"
	"time"

	"github.com/syafiqparadisam/paymentku/services/history/domain"
	"github.com/syafiqparadisam/paymentku/services/history/dto"
	"github.com/syafiqparadisam/paymentku/services/history/errors"
)

func (u *Usecase) DeleteHistoryTransferById(user *dto.XUserData, id int) dto.APIResponse[interface{}] {
	userid, _ := strconv.Atoi(user.UserId)

	ctx := context.TODO()
	tx, err := u.tfRepo.StartACID(ctx)
	if err != nil {
		panic(err)
	}
	// delete history
	errDelete := u.tfRepo.DeleteHistoryTransferById(tx, ctx, id, userid)
	if errDelete == errors.ErrNothingToDel {
		return dto.APIResponse[interface{}]{StatusCode: 200, Message: errors.ErrNothingToDel.Error()}
	}
	if errDelete != nil {
		tx.Rollback()
		panic(errDelete)
	}
	if err := tx.Commit(); err != nil {
		panic(err)
	}
	return dto.APIResponse[interface{}]{StatusCode: 200, Message: "Successfully deleted"}
}

func (u *Usecase) DeleteAllHistoryTransfer(user *dto.XUserData) dto.APIResponse[interface{}] {
	userid, _ := strconv.Atoi(user.UserId)
	// find account by id
	ctx := context.TODO()
	tx, err := u.tfRepo.StartACID(ctx)
	if err != nil {
		panic(err)
	}

	// delete history
	errDeleteHistory := u.tfRepo.DeleteAllHistoryTransfer(tx, ctx, userid)
	if errDeleteHistory == errors.ErrNothingToDel {
		return dto.APIResponse[interface{}]{StatusCode: http.StatusOK, Message: errors.ErrNothingToDel.Error()}
	}
	if errDeleteHistory != nil {
		tx.Rollback()
		panic(errDeleteHistory)
	}
	if err := tx.Commit(); err != nil {
		panic(err)
	}

	return dto.APIResponse[interface{}]{StatusCode: http.StatusOK, Message: "Successfully deleted"}
}

func (u *Usecase) GetAllHistoryTransfer(user *dto.XUserData) dto.APIResponse[*[]domain.HistoryTransferForGetAll] {
	userid, _ := strconv.Atoi(user.UserId)
	// find account by id
	ctx := context.TODO()

	data, errFind := u.tfRepo.GetAllHistoryTransfer(ctx, userid)
	
	if errFind != nil {
		panic(errFind)
	}
	return dto.APIResponse[*[]domain.HistoryTransferForGetAll]{StatusCode: 200, Data: data, Message: "Ok"}
}

func (u *Usecase) GetHistoryTransferById(user *dto.XUserData, id int) dto.APIResponse[*domain.HistoryTransfer] {
	userid, _ := strconv.Atoi(user.UserId)
	// find account by id
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	isRead, errFind := u.tfRepo.FindIsRead(ctx, id)
	if errFind == sql.ErrNoRows {
		return dto.APIResponse[*domain.HistoryTransfer]{StatusCode: 404, Message: errors.ErrHistoryNoRows.Error()}
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
		return dto.APIResponse[*domain.HistoryTransfer]{StatusCode: 404, Message: errors.ErrHistoryNoRows.Error()}
	}
	if errFind != nil {
		panic(errFind)
	}
	if ctx.Err() == context.DeadlineExceeded {
		return dto.APIResponse[*domain.HistoryTransfer]{StatusCode: http.StatusInternalServerError, Message: errors.ErrServer.Error()}
	}
	return dto.APIResponse[*domain.HistoryTransfer]{StatusCode: 200, Data: data, Message: "Ok"}
}
