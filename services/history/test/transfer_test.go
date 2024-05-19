package test

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
	controller_http "github.com/syafiqparadisam/paymentku/services/history/controller/http"
	"github.com/syafiqparadisam/paymentku/services/history/domain"
	"github.com/syafiqparadisam/paymentku/services/history/dto"
	"github.com/syafiqparadisam/paymentku/services/history/errors"
	"github.com/syafiqparadisam/paymentku/services/history/test/mock"
)

func (h *HistoryTest) GetAllHistoryTransfer(t *testing.T) {
	t.Parallel()

	userMock1 := mock.NewUser1ProfileMock()
	senderIdProfile, senderIdUser := h.Seeder.UserSeeder.Up(userMock1)

	userMock2 := mock.NewUser2ProfileMock()
	receiverIdProfile, receiverIdUser := h.Seeder.UserSeeder.Up(userMock2)

	tfMock1 := mock.NewHistoryTransfer1(senderIdUser, userMock1, userMock2)
	idTransfer1 := h.Seeder.TransferSeeder.Up(tfMock1)

	tfMock2 := mock.NewHistoryTransfer2(senderIdUser, userMock1, userMock2)
	idTransfer2 := h.Seeder.TransferSeeder.Up(tfMock2)

	server := httptest.NewServer(controller_http.MakeHTTPHandler(h.Controller.ExstractHeaderXUserData(h.Controller.HandleAllTransferHistory), http.MethodGet, http.MethodDelete))
	defer func() {
		h.Seeder.TransferSeeder.Down(idTransfer1)
		h.Seeder.TransferSeeder.Down(idTransfer2)
		h.Seeder.UserSeeder.Down(senderIdUser, senderIdProfile)
		h.Seeder.UserSeeder.Down(receiverIdUser, receiverIdProfile)
		server.Close()
	}()

	req, _ := http.NewRequest(http.MethodGet, server.URL+fmt.Sprintf("/transfer?userid=%d", senderIdUser), http.NoBody)
	client := &http.Client{}
	resp, _ := client.Do(req)

	bodyBytes, _ := io.ReadAll(resp.Body)
	actualResp := &dto.APIResponse[*[]domain.HistoryTransferForGetAll]{}
	json.Unmarshal(bodyBytes, actualResp)

	findHistory, _ := h.Seeder.TransferSeeder.FindAll(int(senderIdUser))

	sliceHistory := *findHistory

	assert.Equal(t, http.StatusOK, resp.StatusCode)
	assert.Equal(t, http.StatusOK, actualResp.StatusCode)
	assert.Equal(t, "Ok", actualResp.Message)

	for i, a := range sliceHistory {
		assert.Equal(t, a.Id, sliceHistory[i].Id)
		assert.Equal(t, a.Amount, sliceHistory[i].Amount)
		assert.Equal(t, a.CreatedAt, sliceHistory[i].CreatedAt)
		assert.Equal(t, a.IsRead, sliceHistory[i].IsRead)
		assert.Equal(t, a.Receiver, sliceHistory[i].Receiver)
		assert.Equal(t, a.Sender, sliceHistory[i].Sender)
		assert.Equal(t, a.Status, sliceHistory[i].Status)
	}
	assert.Equal(t, sliceHistory, *actualResp.Data)
}

func (h *HistoryTest) GetHistoryTransferById(t *testing.T) {
	t.Parallel()

	userMock1 := mock.NewUser1ProfileMock()
	senderIdProfile, senderIdUser := h.Seeder.UserSeeder.Up(userMock1)

	userMock2 := mock.NewUser2ProfileMock()
	receiverIdProfile, receiverIdUser := h.Seeder.UserSeeder.Up(userMock2)

	tfMock1 := mock.NewHistoryTransfer1(senderIdUser, userMock1, userMock2)
	idTransfer1 := h.Seeder.TransferSeeder.Up(tfMock1)

	server := httptest.NewServer(controller_http.MakeHTTPHandler(h.Controller.ExstractHeaderXUserData(h.Controller.HandleTransferHistoryById), http.MethodGet, http.MethodDelete))
	defer func() {
		h.Seeder.TransferSeeder.Down(idTransfer1)
		h.Seeder.UserSeeder.Down(senderIdUser, senderIdProfile)
		h.Seeder.UserSeeder.Down(receiverIdUser, receiverIdProfile)
		server.Close()
	}()

	req, _ := http.NewRequest(http.MethodGet, server.URL+fmt.Sprintf("/transfer/%d?userid=%d", idTransfer1, senderIdUser), http.NoBody)
	client := &http.Client{}
	resp, _ := client.Do(req)

	bodyBytes, _ := io.ReadAll(resp.Body)
	actualResp := &dto.APIResponse[*domain.HistoryTransfer]{}
	json.Unmarshal(bodyBytes, actualResp)

	findHistory, _ := h.Seeder.TransferSeeder.FindById(int(idTransfer1), int(senderIdUser))

	assert.Equal(t, http.StatusOK, resp.StatusCode)
	assert.Equal(t, http.StatusOK, actualResp.StatusCode)
	assert.Equal(t, "Ok", actualResp.Message)

	assert.Equal(t, findHistory.Id, int(idTransfer1))
	assert.Equal(t, findHistory.Id, actualResp.Data.Id)
	assert.Equal(t, findHistory.Amount, actualResp.Data.Amount)
	assert.Equal(t, findHistory.CreatedAt, actualResp.Data.CreatedAt)
	assert.Equal(t, findHistory.IsRead, actualResp.Data.IsRead)
	assert.Equal(t, findHistory.Notes, actualResp.Data.Notes)
	assert.Equal(t, findHistory.Receiver, actualResp.Data.Receiver)
	assert.Equal(t, findHistory.ReceiverName, actualResp.Data.ReceiverName)
	assert.Equal(t, findHistory.Sender, actualResp.Data.Sender)
	assert.Equal(t, findHistory.SenderName, actualResp.Data.SenderName)
	assert.Equal(t, findHistory.Status, actualResp.Data.Status)
	assert.Equal(t, *findHistory, *actualResp.Data)
}

func (h *HistoryTest) GetHistoryTransferByWrongId(t *testing.T) {
	t.Parallel()

	userMock1 := mock.NewUser1ProfileMock()
	senderIdProfile, senderIdUser := h.Seeder.UserSeeder.Up(userMock1)

	userMock2 := mock.NewUser2ProfileMock()
	receiverIdProfile, receiverIdUser := h.Seeder.UserSeeder.Up(userMock2)

	tfMock1 := mock.NewHistoryTransfer1(senderIdUser, userMock1, userMock2)
	idTransfer1 := h.Seeder.TransferSeeder.Up(tfMock1)

	server := httptest.NewServer(controller_http.MakeHTTPHandler(h.Controller.ExstractHeaderXUserData(h.Controller.HandleTransferHistoryById), http.MethodGet, http.MethodDelete))
	defer func() {
		h.Seeder.TransferSeeder.Down(idTransfer1)
		h.Seeder.UserSeeder.Down(senderIdUser, senderIdProfile)
		h.Seeder.UserSeeder.Down(receiverIdUser, receiverIdProfile)
		server.Close()
	}()

	randomIdTf := 20324
	req, _ := http.NewRequest(http.MethodGet, server.URL+fmt.Sprintf("/transfer/%d?userid=%d", randomIdTf, senderIdUser), http.NoBody)
	client := &http.Client{}
	resp, _ := client.Do(req)

	bodyBytes, _ := io.ReadAll(resp.Body)
	actualResp := &dto.APIResponse[*domain.HistoryTransfer]{}
	json.Unmarshal(bodyBytes, actualResp)

	assert.Equal(t, http.StatusNotFound, resp.StatusCode)
	assert.Equal(t, http.StatusNotFound, actualResp.StatusCode)
	assert.Equal(t, errors.ErrHistoryNoRows.Error(), actualResp.Message)
}

func (h *HistoryTest) DeleteHistoryTransferById(t *testing.T) {
	t.Parallel()

	userMock1 := mock.NewUser1ProfileMock()
	senderIdProfile, senderIdUser := h.Seeder.UserSeeder.Up(userMock1)

	userMock2 := mock.NewUser2ProfileMock()
	receiverIdProfile, receiverIdUser := h.Seeder.UserSeeder.Up(userMock2)

	tfMock1 := mock.NewHistoryTransfer1(senderIdUser, userMock1, userMock2)
	idTransfer1 := h.Seeder.TransferSeeder.Up(tfMock1)

	server := httptest.NewServer(controller_http.MakeHTTPHandler(h.Controller.ExstractHeaderXUserData(h.Controller.HandleTransferHistoryById), http.MethodGet, http.MethodDelete))
	defer func() {
		h.Seeder.UserSeeder.Down(senderIdUser, senderIdProfile)
		h.Seeder.UserSeeder.Down(receiverIdUser, receiverIdProfile)
		server.Close()
	}()

	req, _ := http.NewRequest(http.MethodDelete, server.URL+fmt.Sprintf("/transfer/%d?userid=%d", idTransfer1, senderIdUser), http.NoBody)
	client := &http.Client{}
	resp, _ := client.Do(req)

	_, errFind := h.Seeder.TransferSeeder.FindById(int(idTransfer1), int(senderIdUser))
	assert.Equal(t, errFind, sql.ErrNoRows)

	bodyBytes, _ := io.ReadAll(resp.Body)
	actualResp := &dto.APIResponse[*domain.HistoryTransfer]{}
	json.Unmarshal(bodyBytes, actualResp)

	assert.Equal(t, http.StatusOK, resp.StatusCode)
	assert.Equal(t, http.StatusOK, actualResp.StatusCode)
	assert.Equal(t, "Successfully deleted", actualResp.Message)
}

func (h *HistoryTest) DeleteHistoryTransferByWrongId(t *testing.T) {
	t.Parallel()

	userMock1 := mock.NewUser1ProfileMock()
	senderIdProfile, senderIdUser := h.Seeder.UserSeeder.Up(userMock1)

	userMock2 := mock.NewUser2ProfileMock()
	receiverIdProfile, receiverIdUser := h.Seeder.UserSeeder.Up(userMock2)

	tfMock1 := mock.NewHistoryTransfer1(senderIdUser, userMock1, userMock2)
	idTransfer1 := h.Seeder.TransferSeeder.Up(tfMock1)

	server := httptest.NewServer(controller_http.MakeHTTPHandler(h.Controller.ExstractHeaderXUserData(h.Controller.HandleTransferHistoryById), http.MethodGet, http.MethodDelete))
	defer func() {
		h.Seeder.TransferSeeder.Down(idTransfer1)
		h.Seeder.UserSeeder.Down(senderIdUser, senderIdProfile)
		h.Seeder.UserSeeder.Down(receiverIdUser, receiverIdProfile)
		server.Close()
	}()

	randomIdTf := 23042
	req, _ := http.NewRequest(http.MethodDelete, server.URL+fmt.Sprintf("/transfer/%d?userid=%d", randomIdTf, senderIdUser), http.NoBody)
	client := &http.Client{}
	resp, _ := client.Do(req)

	bodyBytes, _ := io.ReadAll(resp.Body)
	actualResp := &dto.APIResponse[*domain.HistoryTransfer]{}
	json.Unmarshal(bodyBytes, actualResp)

	assert.Equal(t, http.StatusBadRequest, resp.StatusCode)
	assert.Equal(t, http.StatusBadRequest, actualResp.StatusCode)
	assert.Equal(t, errors.ErrNothingToDel.Error(), actualResp.Message)
}

func (h *HistoryTest) DeleteAllHistoryTransfer(t *testing.T) {
	t.Parallel()

	userMock1 := mock.NewUser1ProfileMock()
	senderIdProfile, senderIdUser := h.Seeder.UserSeeder.Up(userMock1)

	userMock2 := mock.NewUser2ProfileMock()
	receiverIdProfile, receiverIdUser := h.Seeder.UserSeeder.Up(userMock2)

	tfMock1 := mock.NewHistoryTransfer1(senderIdUser, userMock1, userMock2)
	idTransfer1 := h.Seeder.TransferSeeder.Up(tfMock1)

	tfMock2 := mock.NewHistoryTransfer2(senderIdUser, userMock1, userMock2)
	idTransfer2 := h.Seeder.TransferSeeder.Up(tfMock2)

	server := httptest.NewServer(controller_http.MakeHTTPHandler(h.Controller.ExstractHeaderXUserData(h.Controller.HandleAllTransferHistory), http.MethodGet, http.MethodDelete))
	defer func() {
		h.Seeder.UserSeeder.Down(senderIdUser, senderIdProfile)
		h.Seeder.UserSeeder.Down(receiverIdUser, receiverIdProfile)
		server.Close()
	}()

	req, _ := http.NewRequest(http.MethodDelete, server.URL+fmt.Sprintf("/transfer?userid=%d", senderIdUser), http.NoBody)
	client := &http.Client{}
	resp, _ := client.Do(req)

	_, errFind1 := h.Seeder.TransferSeeder.FindById(int(idTransfer1), int(senderIdUser))
	assert.Equal(t, errFind1, sql.ErrNoRows)

	_, errFind2 := h.Seeder.TransferSeeder.FindById(int(idTransfer2), int(senderIdUser))
	assert.Equal(t, errFind2, sql.ErrNoRows)

	bodyBytes, _ := io.ReadAll(resp.Body)
	actualResp := &dto.APIResponse[*domain.HistoryTransfer]{}
	json.Unmarshal(bodyBytes, actualResp)

	assert.Equal(t, http.StatusOK, resp.StatusCode)
	assert.Equal(t, http.StatusOK, actualResp.StatusCode)
	assert.Equal(t, "Successfully deleted", actualResp.Message)
}
