package test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/syafiqparadisam/paymentku/services/user/domain"
	"github.com/syafiqparadisam/paymentku/services/user/dto"
	"github.com/syafiqparadisam/paymentku/services/user/errors"
	user_mock "github.com/syafiqparadisam/paymentku/services/user/test/mock"
)

func (pr *ProfileTestWeb) GetProfileById(t *testing.T) {
	t.Parallel()
	// create user
	mockUser := user_mock.NewUser1ProfileMock()
	idProfile, idUser := pr.Seeder.Up(mockUser)

	// do request
	req, _ := http.NewRequest(http.MethodGet, fmt.Sprintf("%s?userid=%d", pr.URL, idUser), http.NoBody)
	client := &http.Client{}
	resp, _ := client.Do(req)

	// delete user after test
	defer func() { pr.Seeder.Down(idUser, idProfile) }()

	// compare expected response
	findUser := pr.Seeder.Find(idUser)
	expectedResp := &dto.APIResponse[*domain.Profile]{
		StatusCode: 200,
		Message:    "Ok",
		Data: &domain.Profile{
			User:          mockUser.User,
			Email:         mockUser.Email,
			AccountNumber: mockUser.AccountNumber,
			CreatedAt:     mockUser.CreatedAt,
			Name:          mockUser.Name,
			Balance:       mockUser.Balance,
			PhoneNumber:   mockUser.PhoneNumber,
			Bio:           mockUser.Bio,
			PhotoProfile:  mockUser.PhotoProfile,
			PhotoPublicId: mockUser.PhotoPublicId,
		},
	}

	actualResp := &dto.APIResponse[*domain.Profile]{}
	respBodyBytes, _ := io.ReadAll(resp.Body)
	json.Unmarshal(respBodyBytes, actualResp)

	assert.Equal(t, expectedResp.Data.User, actualResp.Data.User)
	assert.Equal(t, expectedResp.Data.Email, actualResp.Data.Email)
	assert.Equal(t, expectedResp.Data.AccountNumber, actualResp.Data.AccountNumber)
	assert.Equal(t, expectedResp.Data.PhoneNumber, actualResp.Data.PhoneNumber)
	assert.Equal(t, expectedResp.Data.Name, actualResp.Data.Name)
	assert.Equal(t, expectedResp.Data.Bio, actualResp.Data.Bio)
	assert.Equal(t, expectedResp.Data.PhotoProfile, actualResp.Data.PhotoProfile)
	assert.Equal(t, expectedResp.Data.CreatedAt, actualResp.Data.CreatedAt)
	assert.Equal(t, expectedResp.Data.PhotoPublicId, actualResp.Data.PhotoPublicId)

	assert.Equal(t, findUser.Balance, expectedResp.Data.Balance)
	assert.Equal(t, findUser.ProfileId, idProfile)

	assert.Equal(t, expectedResp.StatusCode, resp.StatusCode)
	assert.Equal(t, expectedResp.StatusCode, actualResp.StatusCode)
	assert.Equal(t, expectedResp.Message, actualResp.Message)
	assert.Equal(t, expectedResp.Data, actualResp.Data)
}

func (pr *ProfileTestWeb) GetProfileByAccNumber(t *testing.T) {
	t.Parallel()

	// create 2 user
	mockSender := user_mock.NewUser1ProfileMock()
	mockReceiver := user_mock.NewUser2ProfileMock()
	idReceiverProfile, idReceiverUser := pr.Seeder.Up(mockReceiver)
	idSenderProfile, idSenderUser := pr.Seeder.Up(mockSender)

	// delete 2 user after test
	defer func() {
		pr.Seeder.Down(idSenderUser, idSenderProfile)
		pr.Seeder.Down(idReceiverUser, idReceiverProfile)
	}()

	fmt.Println("llla")
	// setup request body
	payload := &dto.FindUserByAccNumber{AccountNumber: mockReceiver.AccountNumber}
	bytesBody, _ := json.Marshal(payload)
	req, _ := http.NewRequest(http.MethodPost, fmt.Sprintf("%s/accountNumber?userid=%d", pr.URL, idSenderUser), bytes.NewReader(bytesBody))

	// do request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		t.Error(err)
	}

	// compare expected response
	findUser := pr.Seeder.Find(idReceiverUser)
	expectedResp := &dto.APIResponse[*domain.ProfileForFindWithAccount]{
		StatusCode: http.StatusOK,
		Message:    "Ok",
		Data: &domain.ProfileForFindWithAccount{
			User:          mockReceiver.User,
			AccountNumber: mockReceiver.AccountNumber,
			CreatedAt:     mockReceiver.CreatedAt,
			Name:          mockReceiver.Name,
			PhotoProfile:  mockReceiver.PhotoProfile,
		},
	}

	bodyResp, _ := io.ReadAll(resp.Body)
	actualResp := &dto.APIResponse[*domain.ProfileForFindWithAccount]{}
	json.Unmarshal(bodyResp, actualResp)

	fmt.Println("test error")
	assert.Equal(t, expectedResp.StatusCode, resp.StatusCode)
	assert.Equal(t, expectedResp.StatusCode, actualResp.StatusCode)
	assert.Equal(t, expectedResp.Message, actualResp.Message)
	assert.Equal(t, expectedResp.Data, actualResp.Data)
	
	assert.Equal(t, findUser.ProfileId, idReceiverProfile)
	assert.Equal(t, expectedResp.Data.AccountNumber, actualResp.Data.AccountNumber)
	assert.Equal(t, expectedResp.Data.User, actualResp.Data.User)
	assert.Equal(t, expectedResp.Data.Name, actualResp.Data.Name)
	assert.Equal(t, expectedResp.Data.PhotoProfile, actualResp.Data.PhotoProfile)
	assert.Equal(t, expectedResp.Data.CreatedAt, actualResp.Data.CreatedAt)

}

func (pr *ProfileTestWeb) GetProfileByAccNumberWithWrongAccNum(t *testing.T) {
	t.Parallel()

	// create 2 user
	mockSender := user_mock.NewUser1ProfileMock()
	mockReceiver := user_mock.NewUser2ProfileMock()
	idReceiverProfile, idReceiverUser := pr.Seeder.Up(mockReceiver)
	idSenderProfile, idSenderUser := pr.Seeder.Up(mockSender)

	// delete 2 user after test
	defer func() {
		pr.Seeder.Down(idReceiverUser, idReceiverProfile)
		pr.Seeder.Down(idSenderUser, idSenderProfile)
	}()

	// setup request
	payload := &dto.FindUserByAccNumber{AccountNumber: 9432992}
	bytesBody, _ := json.Marshal(payload)
	req, _ := http.NewRequest(http.MethodPost, fmt.Sprintf("%s/accountNumber?userid=%d", pr.URL, idSenderUser), bytes.NewReader(bytesBody))

	// do request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		t.Error(err)
	}

	// compare response body and expected response
	expectedResp := &dto.APIResponse[*domain.Profile]{
		StatusCode: http.StatusNotFound,
		Message:    errors.ErrUserNoRows.Error(),
	}

	bodyResp, _ := io.ReadAll(resp.Body)
	actualResp := &dto.APIResponse[*domain.Profile]{}
	json.Unmarshal(bodyResp, actualResp)

	assert.Equal(t, expectedResp.StatusCode, resp.StatusCode)
	assert.Equal(t, expectedResp.StatusCode, actualResp.StatusCode)
	assert.Equal(t, expectedResp.Message, actualResp.Message)

}
