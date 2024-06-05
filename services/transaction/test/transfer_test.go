package transaction_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
	controllerhttp "github.com/syafiqparadisam/paymentku/services/transaction/controller/http"
	"github.com/syafiqparadisam/paymentku/services/transaction/dto"
	"github.com/syafiqparadisam/paymentku/services/transaction/errors"
	transaction_mock "github.com/syafiqparadisam/paymentku/services/transaction/test/mock"
)

func (tf *TransactionTestWeb) CreateTransferTransaction(t *testing.T) {
	t.Parallel()

	// setup server
	server := httptest.NewServer(controllerhttp.MakeHTTPHandler(controllerhttp.ExstractHeaderXUserData(tf.ControllerHTTP.HandleTransfer), http.MethodPost))
	defer server.Close()

	// create 2 user
	sendermock := transaction_mock.NewUser1ProfileMock()
	receivermock := transaction_mock.NewUser2ProfileMock()
	idSenderProfile, idSenderUser := tf.Seeder.UserSeeder.Up(sendermock)
	idReceiverProfile, idReceiverUser := tf.Seeder.UserSeeder.Up(receivermock)

	defer func() {
		tf.Seeder.TransferSeeder.Down(idSenderUser)
		tf.Seeder.NotifSeeder.Down(idReceiverUser)
		tf.Seeder.UserSeeder.Down(idSenderUser, idSenderProfile)
		tf.Seeder.UserSeeder.Down(idReceiverUser, idReceiverProfile)
	}()

	// setup request
	payload := &dto.TransferRequest{AccountNumber: receivermock.AccountNumber, Notes: "", Amount: 1000}
	byteofDto, _ := json.Marshal(payload)
	req, _ := http.NewRequest(http.MethodPost, server.URL+fmt.Sprintf("?userid=%d", idSenderUser), bytes.NewReader(byteofDto))

	// do request
	client := &http.Client{}
	resp, _ := client.Do(req)
	t.Log(resp)

	expectedResponse := &dto.APIResponse[interface{}]{
		StatusCode: 200,
		Message:    "Successfully transfer",
	}

	// test is store to db ?
	notif := tf.Seeder.NotifSeeder.Find(idReceiverUser)
	history := tf.Seeder.TransferSeeder.Find(idSenderUser)

	bytesResp, err := io.ReadAll(resp.Body)
	if err != nil {
		t.Errorf("error reading response body %s", err.Error())
	}
	actualResponse := &dto.APIResponse[interface{}]{}
	json.Unmarshal(bytesResp, actualResponse)

	// data from notification table
	desc := fmt.Sprintf("You got transfer from %s, Amount: %d, Sender: %s,  Sendername: %s , Notes: %s , Yourbalance: %d", sendermock.User, payload.Amount, sendermock.User, sendermock.Name, payload.Notes, receivermock.Balance+int64(payload.Amount))
	title := fmt.Sprintf("Congratulalation, you got transfer from %s", sendermock.User)
	icon := os.Getenv("TF_ICON")

	// compare test
	assert.Equal(t, expectedResponse.StatusCode, resp.StatusCode)
	assert.Equal(t, expectedResponse.StatusCode, actualResponse.StatusCode)
	assert.Equal(t, expectedResponse.Message, actualResponse.Message)

	for _, n := range *notif {
		assert.NotNil(t, n.Id)
		assert.Equal(t, n.Icon, icon)
		assert.Equal(t, n.IsRead, int8(0))
		assert.Equal(t, n.Title, title)
		assert.NotEmpty(t, n.CreatedAt)
		assert.Equal(t, n.Type, "transfer")
		assert.Equal(t, n.UserId, idReceiverUser)
		assert.Equal(t, n.Description, desc)
	}

	for _, h := range *history {
		assert.NotNil(t, h.Id)
		assert.Equal(t, h.Sender, sendermock.User)
		assert.Equal(t, h.Receiver, receivermock.User)
		assert.Equal(t, h.Notes, payload.Notes)
		assert.Equal(t, h.Amount, payload.Amount)
		assert.Equal(t, h.IsRead, int8(0))
		assert.Equal(t, h.Status, "SUCCESS")
		assert.Equal(t, h.SenderName, sendermock.Name)
		assert.Equal(t, h.ReceiverName, receivermock.Name)
		assert.NotEmpty(t, h.CreatedAt)
		assert.Equal(t, h.UserId, idSenderUser)
	}

	
}

func (tf *TransactionTestWeb) CreateTransferTransactionWithLessBalance(t *testing.T) {
	t.Parallel()

	// setup server
	server := httptest.NewServer(controllerhttp.MakeHTTPHandler(controllerhttp.ExstractHeaderXUserData(tf.ControllerHTTP.HandleTransfer), http.MethodPost))
	defer server.Close()

	// create 2 user
	sendermock := transaction_mock.NewUser1ProfileMock()
	receivermock := transaction_mock.NewUser2ProfileMock()
	idSenderProfile, idSenderUser := tf.Seeder.UserSeeder.Up(sendermock)
	idReceiverProfile, idReceiverUser := tf.Seeder.UserSeeder.Up(receivermock)
	defer func() {
		tf.Seeder.UserSeeder.Down(idSenderUser, idSenderProfile)
		tf.Seeder.UserSeeder.Down(idReceiverUser, idReceiverProfile)
	}()

	// setup request
	payload := &dto.TransferRequest{AccountNumber: receivermock.AccountNumber, Notes: "", Amount: 1000000}
	byteofDto, _ := json.Marshal(payload)
	req, _ := http.NewRequest(http.MethodPost, server.URL+fmt.Sprintf("?userid=%d", idSenderUser), bytes.NewReader(byteofDto))

	// do request
	client := &http.Client{}
	resp, _ := client.Do(req)

	expectedResponse := &dto.APIResponse[interface{}]{
		StatusCode: 400,
		Message:    errors.ErrInsufficientBalance.Error(),
	}

	bytesResp, err := io.ReadAll(resp.Body)
	if err != nil {
		t.Errorf("error reading response body %s", err.Error())
	}

	actualResponse := &dto.APIResponse[interface{}]{}
	json.Unmarshal(bytesResp, actualResponse)
	
	// test
	assert.Equal(t, expectedResponse.StatusCode, resp.StatusCode)
	assert.Equal(t, expectedResponse.StatusCode, actualResponse.StatusCode)
	assert.Equal(t, expectedResponse.Message, actualResponse.Message)
	assert.Equal(t, expectedResponse.Data, actualResponse.Data)
}

func (tf *TransactionTestWeb) CreateTransferTransactionWithSelfAccountNumber(t *testing.T) {
	t.Parallel()

	// create server
	server := httptest.NewServer(controllerhttp.MakeHTTPHandler(controllerhttp.ExstractHeaderXUserData(tf.ControllerHTTP.HandleTransfer), http.MethodPost))
	defer server.Close()

	// creating user
	sendermock := transaction_mock.NewUser1ProfileMock()
	receivermock := transaction_mock.NewUser2ProfileMock()
	idSenderProfile, idSenderUser := tf.Seeder.UserSeeder.Up(sendermock)
	idReceiverProfile, idReceiverUser := tf.Seeder.UserSeeder.Up(receivermock)

	// dto of request
	payload := &dto.TransferRequest{AccountNumber: sendermock.AccountNumber, Notes: "", Amount: 1000}
	byteofDto, _ := json.Marshal(payload)

	// creating request
	req, _ := http.NewRequest(http.MethodPost, server.URL+fmt.Sprintf("?userid=%d", idSenderUser), bytes.NewReader(byteofDto))

	// requesting to server
	client := &http.Client{}
	resp, _ := client.Do(req)

	expectedResponse := &dto.APIResponse[interface{}]{
		StatusCode: 400,
		Message:    errors.ErrTransferWithSameAccount.Error(),
	}

	bytesResp, err := io.ReadAll(resp.Body)
	if err != nil {
		t.Errorf("error reading response body %s", err.Error())
	}

	actualResponse := &dto.APIResponse[interface{}]{}
	json.Unmarshal(bytesResp, actualResponse)
	defer func() {
		tf.Seeder.UserSeeder.Down(idSenderUser, idSenderProfile)
		tf.Seeder.UserSeeder.Down(idReceiverUser, idReceiverProfile)
	}()

	t.Log(*actualResponse)

	assert.Equal(t, expectedResponse.StatusCode, resp.StatusCode)
	assert.Equal(t, expectedResponse.StatusCode, actualResponse.StatusCode)
	assert.Equal(t, expectedResponse.Message, actualResponse.Message)
	assert.Equal(t, expectedResponse.Data, actualResponse.Data)
}
