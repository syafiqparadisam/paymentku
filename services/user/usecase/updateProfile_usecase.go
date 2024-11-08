package usecase

import (
	"context"
	"strconv"
	"unicode"

	"github.com/syafiqparadisam/paymentku/services/user/config"
	"github.com/syafiqparadisam/paymentku/services/user/dto"
	"github.com/syafiqparadisam/paymentku/services/user/errors"
)

type DataImageResp struct {
	PublicId string `json:"publicId"`
}

func (s *Usecase) UpdateBio(ctx context.Context, payload *dto.UpdateBioDTO, userid string) dto.APIResponse[interface{}] {
	log := config.Log()
	userId, _ := strconv.Atoi(userid)
	err := s.User.UpdateBioProfile(ctx, userId, payload.Bio)
	if err == errors.ErrAffectedRows {
		response := dto.APIResponse[interface{}]{StatusCode: 200, Message: errors.ErrAffectedRows.Error()}
		log.Info().Int("Status Code", response.StatusCode).Str("Message", response.Message).Msg("Response logs")
		return response
	}

	if err != nil {
		panic(err)
	}
	err = s.Cache.DeleteProfile(ctx, userId)
	if err != nil {
		panic(err)
	}
	response := dto.APIResponse[interface{}]{StatusCode: 200, Message: "Bio already updated"}
	log.Info().Int("Status Code", response.StatusCode).Str("Message", response.Message).Msg("Response logs")
	return response
}

func (s *Usecase) UpdateName(ctx context.Context, payload *dto.UpdateNameDTO, userid string) dto.APIResponse[interface{}] {
	log := config.Log()
	if len(payload.Name) == 0 {
		response := dto.APIResponse[interface{}]{StatusCode: 400, Message: errors.ErrEmptyField.Error()}
		log.Info().Int("Status Code", response.StatusCode).Str("Message", response.Message).Msg("Response logs")
		return response
	}
	userId, _ := strconv.Atoi(userid)
	err := s.User.UpdateNameProfile(ctx, userId, payload.Name)
	if err == errors.ErrAffectedRows {
		response := dto.APIResponse[interface{}]{StatusCode: 200, Message: errors.ErrAffectedRows.Error()}
		log.Info().Int("Status Code", response.StatusCode).Str("Message", response.Message).Msg("Response logs")
		return response
	}
	if err != nil {
		panic(err)
	}
	err = s.Cache.DeleteProfile(ctx, userId)
	if err != nil {
		panic(err)
	}
	response := dto.APIResponse[interface{}]{StatusCode: 200, Message: "Name already updated"}
	log.Info().Int("Status Code", response.StatusCode).Str("Message", response.Message).Msg("Response logs")
	return response
}

func (s *Usecase) UpdatePhoneNumber(ctx context.Context, payload *dto.UpdatePhoneNumberDTO, userid string) dto.APIResponse[interface{}] {
	log := config.Log()
	validateErr := validatePhoneNumber(payload.PhoneNumber)
	if validateErr != nil {
		response := dto.APIResponse[interface{}]{StatusCode: 400, Message: validateErr.Error()}
		log.Info().Int("Status Code", response.StatusCode).Str("Message", response.Message).Msg("Response logs")
		return response
	}
	userId, _ := strconv.Atoi(userid)
	err := s.User.UpdatePhoneNumber(ctx, userId, payload.PhoneNumber)
	if err == errors.ErrAffectedRows {
		response := dto.APIResponse[interface{}]{StatusCode: 200, Message: err.Error()}
		log.Info().Int("Status Code", response.StatusCode).Str("Message", response.Message).Msg("Response logs")
		return response
	}
	if err != nil {
		panic(err)
	}

	err = s.Cache.DeleteProfile(ctx, userId)
	if err != nil {
		panic(err)
	}
	
	response := dto.APIResponse[interface{}]{StatusCode: 200, Message: "Phone number already updated"}
	log.Info().Int("Status Code", response.StatusCode).Str("Message", response.Message).Msg("Response logs")
	return response
}

func validatePhoneNumber(phoneNumber string) error {
	for _, char := range phoneNumber {
		if !unicode.IsNumber(char) {
			return errors.ErrIsNotNumber
		}
		if !unicode.IsDigit(char) {
			return errors.ErrIsNotNumber
		}
	}
	if len(phoneNumber) < 10 {
		return errors.ErrNumberLengthLess11
	}
	return nil
}
