package usecase

import (
	"strconv"
	"unicode"

	"github.com/syafiqparadisam/paymentku/services/user/dto"
	"github.com/syafiqparadisam/paymentku/services/user/errors"
)

type DataImageResp struct {
	PublicId string `json:"publicId"`
}

func (s *Usecase) UpdateBio(payload *dto.UpdateBioDTO, userid string) dto.APIResponse[interface{}] {

	userId, _ := strconv.Atoi(userid)
	err := s.User.UpdateBioProfile(userId, payload.Bio)
	if err == errors.ErrAffectedRows {
		return dto.APIResponse[interface{}]{StatusCode: 200, Message: errors.ErrAffectedRows.Error()}
	}

	if err != nil {
		panic(err)
	}
	return dto.APIResponse[interface{}]{StatusCode: 200, Message: "Bio already updated"}
}

func (s *Usecase) UpdateName(payload *dto.UpdateNameDTO, userid string) dto.APIResponse[interface{}] {
	if len(payload.Name) == 0 {
		return dto.APIResponse[interface{}]{StatusCode: 400, Message: errors.ErrEmptyField.Error()}
	}
	userId, _ := strconv.Atoi(userid)
	err := s.User.UpdateNameProfile(userId, payload.Name)
	if err == errors.ErrAffectedRows {
		return dto.APIResponse[interface{}]{StatusCode: 200, Message: errors.ErrAffectedRows.Error()}
	}
	if err != nil {
		panic(err)
	}
	return dto.APIResponse[interface{}]{StatusCode: 200, Message: "Name already updated"}
}

func (s *Usecase) UpdatePhoneNumber(payload *dto.UpdatePhoneNumberDTO, userid string) dto.APIResponse[interface{}] {

	validateErr := validatePhoneNumber(payload.PhoneNumber)
	if validateErr != nil {
		return dto.APIResponse[interface{}]{StatusCode: 400, Message: validateErr.Error()}
	}
	userId, _ := strconv.Atoi(userid)
	err := s.User.UpdatePhoneNumber(userId, payload.PhoneNumber)
	if err == errors.ErrAffectedRows {
		return dto.APIResponse[interface{}]{StatusCode: 200, Message: err.Error()}
	}
	if err != nil {
		panic(err)
	}
	return dto.APIResponse[interface{}]{StatusCode: 200, Message: "Phone number already updated"}
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
