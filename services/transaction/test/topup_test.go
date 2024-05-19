package transaction_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/syafiqparadisam/paymentku/services/transaction/controller/http"
	"github.com/syafiqparadisam/paymentku/services/transaction/dto"
	"github.com/syafiqparadisam/paymentku/services/transaction/errors"
	"github.com/syafiqparadisam/paymentku/services/transaction/test/mock"
)

func (tf *TransactionTestWeb) CreateTopUpTransaction(t *testing.T) {
	t.Parallel()

	// dto request
	body := &dto.TopUpRequest{Amount: 10000}
	bodyBytes, _ := json.Marshal(body)

	// create server
	server := httptest.NewServer(controllerhttp.MakeHTTPHandler(controllerhttp.ExstractHeaderXUserData(tf.ControllerHTTP.HandlerTopUp), http.MethodPost))
	defer server.Close()

	// creating user and profile
	usermock := mock.NewUser1ProfileMock()
	idProfile, idUser := tf.Seeder.UserSeeder.Up(usermock)
	// config request
	req, err := http.NewRequest(http.MethodPost, server.URL+fmt.Sprintf("?userid=%d", idUser), bytes.NewReader(bodyBytes))
	if err != nil {
		t.Errorf("Error requesting to server %+v", err)
	}

	// request started
	client := &http.Client{}
	resp, _ := client.Do(req)

	// check in db is correct
	history := tf.Seeder.TopUpSeeder.Find(idUser)
	// delete all seeder
	defer func() {
		tf.Seeder.TopUpSeeder.Down(idUser)
		tf.Seeder.UserSeeder.Down(idUser, idProfile)
	}()

	// expected response
	expected := &dto.APIResponse[interface{}]{
		StatusCode: 200,
		Message:    "succesfully topup",
	}

	bytesResp, err := io.ReadAll(resp.Body)
	actualResponse := &dto.APIResponse[interface{}]{}
	json.Unmarshal(bytesResp, actualResponse)

	if err != nil {
		t.Error(err)
	}

	for _, h := range *history {
		assert.NotNil(t, h.Id)
		assert.Equal(t, h.PreviousBalance, usermock.Balance)
		assert.Equal(t, h.Status, "SUCCESS")
		assert.Equal(t, h.Amount, body.Amount)
		assert.Equal(t, h.Balance, usermock.Balance+int64(body.Amount))
		assert.Equal(t, h.IsRead, int8(0))
		assert.Equal(t, h.UserId, idUser)
		assert.NotEmpty(t, h.CreatedAt)
	}

	assert.Equal(t, expected.StatusCode, resp.StatusCode)
	assert.Equal(t, expected.StatusCode, actualResponse.StatusCode)
	assert.Equal(t, expected.Message, actualResponse.Message)
}

func (tf *TransactionTestWeb) CreateTopUpTransactionWith0Amount(t *testing.T) {
	t.Parallel()

	// dto request
	body := &dto.TopUpRequest{Amount: 0}
	bodyBytes, _ := json.Marshal(body)

	// create server
	server := httptest.NewServer(controllerhttp.MakeHTTPHandler(controllerhttp.ExstractHeaderXUserData(tf.ControllerHTTP.HandlerTopUp), http.MethodPost))
	defer server.Close()

	// creating user and profile
	usermock := mock.NewUser1ProfileMock()
	idProfile, idUser := tf.Seeder.UserSeeder.Up(usermock)

	// config request
	req, err := http.NewRequest(http.MethodPost, server.URL+fmt.Sprintf("?userid=%d", idUser), bytes.NewReader(bodyBytes))
	if err != nil {
		t.Errorf("Error requesting to server %+v", err)
	}

	// request started
	client := &http.Client{}
	resp, _ := client.Do(req)

	// delete all seeder
	// tf.Seeder.TopUpSeeder.Down(userid)
	defer tf.Seeder.UserSeeder.Down(idUser, idProfile)

	// mock response
	expected := &dto.APIResponse[interface{}]{
		StatusCode: 400,
		Message:    errors.ErrAmountIsLessThanZero.Error(),
	}

	bytesResp, err := io.ReadAll(resp.Body)
	actualResponse := &dto.APIResponse[interface{}]{}
	json.Unmarshal(bytesResp, actualResponse)
	t.Log(*actualResponse)

	if err != nil {
		t.Error(err)
	}

	assert.Equal(t, expected.StatusCode, resp.StatusCode)
	assert.Equal(t, expected.StatusCode, actualResponse.StatusCode)
	assert.Equal(t, expected.Message, actualResponse.Message)
}
