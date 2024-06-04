package usecase

import (
	"context"
	"database/sql"
	"net/http"
	"strconv"

	"github.com/syafiqparadisam/paymentku/services/user/config"
	"github.com/syafiqparadisam/paymentku/services/user/domain"
	"github.com/syafiqparadisam/paymentku/services/user/dto"
	"github.com/syafiqparadisam/paymentku/services/user/errors"
)

func (s *Usecase) GetUserProfile(ctx context.Context, userid string) dto.APIResponse[*domain.Profile] {
	log := config.Log()
	userId, _ := strconv.Atoi(userid)
	result, err := s.User.GetProfile(ctx, userId)
	if err != nil {
		panic(err)
	}
	response := dto.APIResponse[*domain.Profile]{StatusCode: http.StatusOK, Data: result, Message: "Ok"}
	log.Info().Int("Status Code", response.StatusCode).Interface("Data", response.Data).Str("Message", response.Message).Msg("Response logs")
	return response
}

func (s *Usecase) GetUserProfileByAccNumber(ctx context.Context, payload *dto.FindUserByAccNumber) dto.APIResponse[*domain.ProfileForFindWithAccount] {
	log := config.Log()
	result, err := s.User.GetUserProfileByAccNumber(ctx, payload.AccountNumber)
	if err == sql.ErrNoRows {
		response := dto.APIResponse[*domain.ProfileForFindWithAccount]{StatusCode: http.StatusNotFound, Message: errors.ErrUserNoRows.Error()}
		log.Info().Int("Status Code", response.StatusCode).Str("Message", response.Message).Msg("Response logs")
		return response
	}
	if err != nil {
		panic(err)
	}

	response := dto.APIResponse[*domain.ProfileForFindWithAccount]{StatusCode: http.StatusOK, Data: result, Message: "Ok"}
	log.Info().Int("Status Code", response.StatusCode).Interface("Data", response.Data).Str("Message", response.Message).Msg("Response logs")
	return response
}
