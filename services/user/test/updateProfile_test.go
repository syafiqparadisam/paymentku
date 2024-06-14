package test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
	domain "github.com/syafiqparadisam/paymentku/services/user/domain"
	"github.com/syafiqparadisam/paymentku/services/user/dto"
	"github.com/syafiqparadisam/paymentku/services/user/errors"
	user_mock "github.com/syafiqparadisam/paymentku/services/user/test/mock"
)

func (pr *ProfileTestWeb) UpdateName(t *testing.T) {
	t.Parallel()
	mockUser := user_mock.NewUser1ProfileMock()
	idProfile, idUser := pr.Seeder.Up(mockUser)
	defer func() {
		pr.Seeder.Down(idUser, idProfile)
	}()
	namedto := "muhammad"
	payload := &dto.UpdateNameDTO{Name: namedto}
	bytesBody, _ := json.Marshal(payload)

	req, _ := http.NewRequest(http.MethodPatch, fmt.Sprintf("%s/name?userid=%d", pr.URL, idUser), bytes.NewReader(bytesBody))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		t.Error(err)
	}
	expectedResp := &dto.APIResponse[*domain.Profile]{
		StatusCode: http.StatusOK,
		Message:    "Name already updated",
	}

	findUser := pr.Seeder.Find(idUser)

	assert.Equal(t, findUser.Name, payload.Name)

	bodyResp, _ := io.ReadAll(resp.Body)
	actualResp := &dto.APIResponse[*domain.Profile]{}
	json.Unmarshal(bodyResp, actualResp)

	assert.Equal(t, expectedResp.StatusCode, resp.StatusCode)
	assert.Equal(t, expectedResp.StatusCode, actualResp.StatusCode)
	assert.Equal(t, expectedResp.Message, actualResp.Message)
}

func (pr *ProfileTestWeb) UpdateNameWithEmptyString(t *testing.T) {
	t.Parallel()
	mockUser := user_mock.NewUser1ProfileMock()
	idProfile, idUser := pr.Seeder.Up(mockUser)
	defer func() {
		pr.Seeder.Down(idUser, idProfile)
	}()
	nameDto := ""
	payload := &dto.UpdateNameDTO{Name: nameDto}
	bytesBody, _ := json.Marshal(payload)

	req, _ := http.NewRequest(http.MethodPatch, fmt.Sprintf("%s/name?userid=%d", pr.URL, idUser), bytes.NewReader(bytesBody))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		t.Error(err)
	}
	expectedResp := &dto.APIResponse[*domain.Profile]{
		StatusCode: http.StatusBadRequest,
		Message:    errors.ErrEmptyField.Error(),
	}

	bodyResp, _ := io.ReadAll(resp.Body)
	actualResp := &dto.APIResponse[*domain.Profile]{}
	json.Unmarshal(bodyResp, actualResp)

	assert.Equal(t, expectedResp.StatusCode, resp.StatusCode)
	assert.Equal(t, expectedResp.StatusCode, actualResp.StatusCode)
	assert.Equal(t, expectedResp.Message, actualResp.Message)
}

func (pr *ProfileTestWeb) UpdateBio(t *testing.T) {
	t.Parallel()
	mockUser := user_mock.NewUser1ProfileMock()
	idProfile, idUser := pr.Seeder.Up(mockUser)
	defer func() {
		pr.Seeder.Down(idUser, idProfile)
	}()
	bioDto := "HEyy BROO"
	payload := &dto.UpdateBioDTO{Bio: bioDto}
	bytesBody, _ := json.Marshal(payload)

	req, _ := http.NewRequest(http.MethodPatch, fmt.Sprintf("%s/bio?userid=%d", pr.URL, idUser), bytes.NewReader(bytesBody))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		t.Error(err)
	}

	findUser := pr.Seeder.Find(idUser)
	// var bio string = "Hai bro perkenalkan ya nama aku mas rull"
	// var pp string = "https://placeholder.com/200x200"

	expectedResp := &dto.APIResponse[*domain.Profile]{
		StatusCode: http.StatusOK,
		Message:    "Bio already updated",
	}
	t.Log(findUser)
	assert.Equal(t, findUser.Bio, bioDto)

	bodyResp, _ := io.ReadAll(resp.Body)
	actualResp := &dto.APIResponse[*domain.Profile]{}
	json.Unmarshal(bodyResp, actualResp)

	assert.Equal(t, expectedResp.StatusCode, resp.StatusCode)
	assert.Equal(t, expectedResp.StatusCode, actualResp.StatusCode)
	assert.Equal(t, expectedResp.Message, actualResp.Message)
}

func (pr *ProfileTestWeb) UpdatePhoneNumber(t *testing.T) {
	t.Parallel()
	mockUser := user_mock.NewUser1ProfileMock()
	idProfile, idUser := pr.Seeder.Up(mockUser)
	defer func() {
		pr.Seeder.Down(idUser, idProfile)
	}()
	phoneDto := "04282942342"
	payload := &dto.UpdatePhoneNumberDTO{PhoneNumber: phoneDto}
	bytesBody, _ := json.Marshal(payload)

	req, _ := http.NewRequest(http.MethodPatch, fmt.Sprintf("%s/phoneNumber?userid=%d", pr.URL, idUser), bytes.NewReader(bytesBody))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		t.Error(err)
	}
	findUser := pr.Seeder.Find(idUser)

	expectedResp := &dto.APIResponse[*domain.Profile]{
		StatusCode: http.StatusOK,
		Message:    "Phone number already updated",
	}

	assert.Equal(t, findUser.PhoneNumber, phoneDto)

	bodyResp, _ := io.ReadAll(resp.Body)
	actualResp := &dto.APIResponse[*domain.Profile]{}
	json.Unmarshal(bodyResp, actualResp)

	assert.Equal(t, expectedResp.StatusCode, resp.StatusCode)
	assert.Equal(t, expectedResp.StatusCode, actualResp.StatusCode)
	assert.Equal(t, expectedResp.Message, actualResp.Message)
}

func (pr *ProfileTestWeb) WrongUpdatePhoneNumber(t *testing.T) {
	t.Parallel()
	mockUser := user_mock.NewUser1ProfileMock()
	idProfile, idUser := pr.Seeder.Up(mockUser)
	defer func() {
		pr.Seeder.Down(idUser, idProfile)
	}()
	phoneDto := "awikwokk32ww"
	payload := &dto.UpdatePhoneNumberDTO{PhoneNumber: phoneDto}
	bytesBody, _ := json.Marshal(payload)

	req, _ := http.NewRequest(http.MethodPatch, fmt.Sprintf("%s/phoneNumber?userid=%d", pr.URL, idUser), bytes.NewReader(bytesBody))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		t.Error(err)
	}

	expectedResp := &dto.APIResponse[*domain.Profile]{
		StatusCode: http.StatusBadRequest,
		Message:    errors.ErrIsNotNumber.Error(),
	}

	bodyResp, _ := io.ReadAll(resp.Body)
	actualResp := &dto.APIResponse[*domain.Profile]{}
	json.Unmarshal(bodyResp, actualResp)

	assert.Equal(t, expectedResp.StatusCode, resp.StatusCode)
	assert.Equal(t, expectedResp.StatusCode, actualResp.StatusCode)
	assert.Equal(t, expectedResp.Message, actualResp.Message)
}

func (pr *ProfileTestWeb) UpdatePhoneNumberLessThan10Digit(t *testing.T) {
	t.Parallel()
	mockUser := user_mock.NewUser1ProfileMock()
	idProfile, idUser := pr.Seeder.Up(mockUser)
	defer func() {
		pr.Seeder.Down(idUser, idProfile)
	}()
	phoneDto := "084223942"
	payload := &dto.UpdatePhoneNumberDTO{PhoneNumber: phoneDto}
	bytesBody, _ := json.Marshal(payload)

	req, _ := http.NewRequest(http.MethodPatch, fmt.Sprintf("%s/phoneNumber?userid=%d", pr.URL, idUser), bytes.NewReader(bytesBody))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		t.Error(err)
	}

	expectedResp := &dto.APIResponse[*domain.Profile]{
		StatusCode: http.StatusBadRequest,
		Message:    errors.ErrNumberLengthLess11.Error(),
	}

	bodyResp, _ := io.ReadAll(resp.Body)
	actualResp := &dto.APIResponse[*domain.Profile]{}
	json.Unmarshal(bodyResp, actualResp)

	assert.Equal(t, expectedResp.StatusCode, resp.StatusCode)
	assert.Equal(t, expectedResp.StatusCode, actualResp.StatusCode)
	assert.Equal(t, expectedResp.Message, actualResp.Message)
}
