package usecase

import (
	"context"
	"database/sql"
	"strconv"

	"github.com/syafiqparadisam/paymentku/services/history/domain"
	"github.com/syafiqparadisam/paymentku/services/history/dto"
	"github.com/syafiqparadisam/paymentku/services/history/errors"
)

func (u *Usecase) GetAllHistoryTopUp(ctx context.Context, user *dto.XUserData) dto.APIResponse[*[]domain.HistoryTopUpForGetAll] {
	userid, _ := strconv.Atoi(user.UserId)

	history, err := u.topUpRepo.GetAllHistoryTopUp(ctx, userid)
	if err != nil {
		panic(err)
	}
	return dto.APIResponse[*[]domain.HistoryTopUpForGetAll]{StatusCode: 200, Data: history, Message: "Ok"}
}

func (u *Usecase) GetHistoryTopUpById(ctx context.Context, user *dto.XUserData, id int) dto.APIResponse[*domain.HistoryTopUp] {
	userid, _ := strconv.Atoi(user.UserId)
	// find is read and do some conditional
	isRead, errFind := u.topUpRepo.FindIsRead(ctx, id)
	if errFind == sql.ErrNoRows {
		return dto.APIResponse[*domain.HistoryTopUp]{StatusCode: 404, Message: errors.ErrHistoryNoRows.Error()}
	}
	if errFind != nil {
		panic(errFind)
	}

	// if isRead is false, update isRead to true
	if isRead.IsRead == 0 {
		errUpdate := u.topUpRepo.UpdateIsRead(ctx, id)
		if errUpdate != nil {
			panic(errUpdate)
		}
	}

	history, err := u.topUpRepo.GetHistoryTopUpById(ctx, id, userid)
	if err == sql.ErrNoRows {
		return dto.APIResponse[*domain.HistoryTopUp]{StatusCode: 404, Message: errors.ErrHistoryNoRows.Error()}
	}

	if err != nil {
		panic(err)
	}

	return dto.APIResponse[*domain.HistoryTopUp]{StatusCode: 200, Data: history, Message: "Ok"}
}

func (u *Usecase) DeleteAllHistoryTopUp(ctx context.Context, user *dto.XUserData) dto.APIResponse[interface{}] {
	userid, _ := strconv.Atoi(user.UserId)
	tx, err := u.topUpRepo.StartACID(ctx)

	if err != nil {
		panic(err)
	}
	err = u.topUpRepo.DeleteAllHistoryTopUp(tx, ctx, userid)
	if err == errors.ErrNothingToDel {
		return dto.APIResponse[interface{}]{StatusCode: 200, Message: errors.ErrNothingToDel.Error()}
	}
	if err != nil {
		panic(err)
	}
	if err := tx.Commit(); err != nil {
		panic(err)
	}
	return dto.APIResponse[interface{}]{StatusCode: 200, Message: "Successfully deleted"}
}

func (u *Usecase) DeleteHistoryTopUpById(ctx  context.Context,user *dto.XUserData, id int) dto.APIResponse[interface{}] {
	userid, _ := strconv.Atoi(user.UserId)
	tx, err := u.topUpRepo.StartACID(ctx)
	if err != nil {
		panic(err)
	}
	err = u.topUpRepo.DeleteHistoryTopUpById(tx, ctx, id, userid)
	if err == errors.ErrNothingToDel {
		return dto.APIResponse[interface{}]{StatusCode: 200, Message: errors.ErrNothingToDel.Error()}
	}
	if err != nil {
		panic(err)
	}
	if err := tx.Commit(); err != nil {
		panic(err)
	}
	return dto.APIResponse[interface{}]{StatusCode: 200, Message: "Successfully deleted"}
}
