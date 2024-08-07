package usecase

import (
	"context"
	"database/sql"
	"fmt"
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
	var result *domain.Profile

	// check cache
	result, errCache := s.Cache.GetProfile(ctx, userId)
	if errCache != nil {
		fmt.Println(errCache)
		panic(errCache)
	}
	fmt.Println(result)
	// cache exist
	if result != nil {
		response := dto.APIResponse[*domain.Profile]{StatusCode: http.StatusOK, Data: result, Message: "Ok"}
		log.Info().Int("Status Code", response.StatusCode).Interface("Data", response.Data).Str("Message", response.Message).Msg("Response logs")
		return response
	}

	// cache isn't exist get from database
	result, err := s.User.GetProfile(ctx, userId)
	if err != nil {
		panic(err)
	}

	// set cache
	err = s.Cache.InsertProfile(ctx, result, userId)
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
