package usecase

import (
	"context"
	"database/sql"
	"net/http"
	"strconv"

	"github.com/syafiqparadisam/paymentku/services/user/domain"
	"github.com/syafiqparadisam/paymentku/services/user/dto"
	"github.com/syafiqparadisam/paymentku/services/user/errors"
)

func (s *Usecase) GetUserProfile(ctx context.Context, userid string) dto.APIResponse[*domain.Profile] {
	userId, _ := strconv.Atoi(userid)
	result, err := s.User.GetProfile(ctx, userId)
	if err != nil {
		panic(err)
	}
	return dto.APIResponse[*domain.Profile]{StatusCode: http.StatusOK, Data: result, Message: "Ok"}
}

func (s *Usecase) GetUserProfileByAccNumber(ctx context.Context, payload *dto.FindUserByAccNumber) dto.APIResponse[*domain.ProfileForFindWithAccount] {

	result, err := s.User.GetUserProfileByAccNumber(ctx, payload.AccountNumber)
	if err == sql.ErrNoRows {
		return dto.APIResponse[*domain.ProfileForFindWithAccount]{StatusCode: http.StatusNotFound, Message: errors.ErrUserNoRows.Error()}
	}
	if err != nil {
		panic(err)
	}
	return dto.APIResponse[*domain.ProfileForFindWithAccount]{StatusCode: http.StatusOK, Data: result, Message: "Ok"}
}
