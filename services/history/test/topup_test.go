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

func (h *HistoryTest) GetAllHistoryTopUp(t *testing.T) {
	t.Parallel()

	// create 2 user
	userMock := mock.NewUser1ProfileMock()
	idProfile, idUser := h.Seeder.UserSeeder.Up(userMock)
	topUpMock1 := mock.NewHistoryTopUp1(userMock, idUser)
	topUpMock2 := mock.NewHistoryTopUp2(userMock, idUser)
	idTopup1 := h.Seeder.TopUpSeeder.Up(topUpMock1)
	idTopUp2 := h.Seeder.TopUpSeeder.Up(topUpMock2)

	// setup server
	server := httptest.NewServer(controller_http.MakeHTTPHandler(h.Controller.ExstractHeaderXUserData(h.Controller.GetAllTopUpHistory), http.MethodGet, http.MethodDelete))
	defer func() {
		h.TopUpSeeder.Down(idTopup1)
		h.TopUpSeeder.Down(idTopUp2)
		h.UserSeeder.Down(idUser, idProfile)
		server.Close()
	}()

	// setup request
	req, _ := http.NewRequest(http.MethodGet, server.URL+fmt.Sprintf("?userid=%d", idUser), http.NoBody)
	client := &http.Client{}
	resp, _ := client.Do(req)

	actualResp := &dto.APIResponse[*[]domain.HistoryTopUpForGetAll]{}
	bodyBytes, _ := io.ReadAll(resp.Body)
	json.Unmarshal(bodyBytes, actualResp)

	arrayofHistory, _ := h.Seeder.TopUpSeeder.FindAll(int(idUser))
	assert.Equal(t, http.StatusOK, actualResp.StatusCode)
	assert.Equal(t, "Ok", actualResp.Message)
	t.Log(*arrayofHistory)

	sliceMock := *arrayofHistory

	for i, a := range *actualResp.Data {
		assert.Equal(t, a.Id, sliceMock[i].Id)
		assert.Equal(t, a.Amount, sliceMock[i].Amount)
		assert.Equal(t, a.IsRead, sliceMock[i].IsRead)
		assert.Equal(t, a.Status, sliceMock[i].Status)
		assert.Equal(t, a.CreatedAt, sliceMock[i].CreatedAt)
	}
	assert.Equal(t, actualResp.Data, arrayofHistory)
}

func (h *HistoryTest) GetHistoryTopUpById(t *testing.T) {
	t.Parallel()

	// create 2 user
	userMock := mock.NewUser1ProfileMock()
	idProfile, idUser := h.Seeder.UserSeeder.Up(userMock)
	topUpMock1 := mock.NewHistoryTopUp1(userMock, idUser)
	idTopup1 := h.Seeder.TopUpSeeder.Up(topUpMock1)
	fmt.Println("idtopup", idTopup1)
	// setup server
	server := httptest.NewServer(controller_http.MakeHTTPHandler(h.Controller.ExstractHeaderXUserData(h.Controller.HandleTopUpHistoryById), http.MethodGet, http.MethodDelete))
	fmt.Println(server.URL + fmt.Sprintf("/topup/%d?userid=%d", idTopup1, idUser))
	req, _ := http.NewRequest(http.MethodGet, server.URL+fmt.Sprintf("/topup/%d?userid=%d", idTopup1, idUser), http.NoBody)
	client := &http.Client{}
	resp, _ := client.Do(req)
	defer func() {
		h.TopUpSeeder.Down(idTopup1)
		h.UserSeeder.Down(idUser, idProfile)
		resp.Body.Close()
		server.Close()
	}()

	actualResp := &dto.APIResponse[*domain.HistoryTopUp]{}
	bodyBytes, _ := io.ReadAll(resp.Body)
	json.Unmarshal(bodyBytes, actualResp)

	historyById, _ := h.Seeder.TopUpSeeder.FindById(int(idTopup1), int(idUser))
	assert.Equal(t, http.StatusOK, actualResp.StatusCode)
	assert.Equal(t, "Ok", actualResp.Message)
	assert.Equal(t, historyById.Id, int(idTopup1))
	assert.Equal(t, historyById.Id, actualResp.Data.Id)
	assert.Equal(t, historyById.Amount, actualResp.Data.Amount)
	assert.Equal(t, historyById.Balance, actualResp.Data.Balance)
	assert.Equal(t, historyById.CreatedAt, actualResp.Data.CreatedAt)
	assert.Equal(t, historyById.IsRead, actualResp.Data.IsRead)
	assert.Equal(t, historyById.PreviousBalance, actualResp.Data.PreviousBalance)
	assert.Equal(t, historyById.Status, actualResp.Data.Status)
	assert.Equal(t, historyById, actualResp.Data)
}

func (h *HistoryTest) GetHistoryTopUpByWrongId(t *testing.T) {
	t.Parallel()
	userMock := mock.NewUser1ProfileMock()
	idProfile, idUser := h.Seeder.UserSeeder.Up(userMock)
	server := httptest.NewServer(controller_http.MakeHTTPHandler(h.Controller.ExstractHeaderXUserData(h.Controller.HandleTopUpHistoryById), http.MethodGet, http.MethodDelete))
	defer func() {
		h.UserSeeder.Down(idUser, idProfile)
		server.Close()
	}()

	randomId := 2422
	req, _ := http.NewRequest(http.MethodGet, server.URL+fmt.Sprintf("/topup/%d?userid=%d", randomId, idUser), http.NoBody)
	client := &http.Client{}
	resp, _ := client.Do(req)

	actualResp := &dto.APIResponse[*domain.HistoryTopUp]{}
	bodyBytes, _ := io.ReadAll(resp.Body)
	json.Unmarshal(bodyBytes, actualResp)

	assert.Equal(t, http.StatusNotFound, actualResp.StatusCode)
	assert.Equal(t, errors.ErrHistoryNoRows.Error(), actualResp.Message)
}

func (h *HistoryTest) DeleteHistoryTopUpById(t *testing.T) {
	t.Parallel()
	userMock := mock.NewUser1ProfileMock()
	idProfile, idUser := h.Seeder.UserSeeder.Up(userMock)
	topUpMock1 := mock.NewHistoryTopUp1(userMock, idUser)
	idTopup1 := h.Seeder.TopUpSeeder.Up(topUpMock1)
	server := httptest.NewServer(controller_http.MakeHTTPHandler(h.Controller.ExstractHeaderXUserData(h.Controller.HandleTopUpHistoryById), http.MethodGet, http.MethodDelete))
	defer func() {
		h.UserSeeder.Down(idUser, idProfile)
		server.Close()
	}()
	req, _ := http.NewRequest(http.MethodDelete, server.URL+fmt.Sprintf("/topup/%d?userid=%d", idTopup1, idUser), http.NoBody)
	client := &http.Client{}
	resp, _ := client.Do(req)

	actualResp := &dto.APIResponse[interface{}]{}
	bodyBytes, _ := io.ReadAll(resp.Body)
	json.Unmarshal(bodyBytes, actualResp)
	_, err := h.Seeder.TopUpSeeder.FindById(int(idTopup1), int(idUser))

	assert.Equal(t, err, sql.ErrNoRows)
	assert.Equal(t, http.StatusOK, actualResp.StatusCode)
	assert.Equal(t, "Successfully deleted", actualResp.Message)
}

func (h *HistoryTest) DeleteHistoryTopUpByWrongId(t *testing.T) {
	t.Parallel()
	userMock := mock.NewUser1ProfileMock()
	idProfile, idUser := h.Seeder.UserSeeder.Up(userMock)
	server := httptest.NewServer(controller_http.MakeHTTPHandler(h.Controller.ExstractHeaderXUserData(h.Controller.HandleTopUpHistoryById), http.MethodGet, http.MethodDelete))
	defer func() {
		h.UserSeeder.Down(idUser, idProfile)
		server.Close()
	}()

	randomId := 2422
	req, _ := http.NewRequest(http.MethodDelete, server.URL+fmt.Sprintf("/topup/%d?userid=%d", randomId, idUser), http.NoBody)
	client := &http.Client{}
	resp, _ := client.Do(req)

	actualResp := &dto.APIResponse[interface{}]{}
	bodyBytes, _ := io.ReadAll(resp.Body)
	json.Unmarshal(bodyBytes, actualResp)

	assert.Equal(t, http.StatusOK, actualResp.StatusCode)
	assert.Equal(t, errors.ErrNothingToDel.Error(), actualResp.Message)
}

func (h *HistoryTest) DeleteAllHistoryTopUp(t *testing.T) {
	t.Parallel()
	userMock := mock.NewUser1ProfileMock()
	idProfile, idUser := h.Seeder.UserSeeder.Up(userMock)
	topUpMock1 := mock.NewHistoryTopUp1(userMock, idUser)
	topUpMock2 := mock.NewHistoryTopUp2(userMock, idUser)
	idTopup1 := h.Seeder.TopUpSeeder.Up(topUpMock1)
	idTopup2 := h.Seeder.TopUpSeeder.Up(topUpMock2)
	server := httptest.NewServer(controller_http.MakeHTTPHandler(h.Controller.ExstractHeaderXUserData(h.Controller.HandleAllTopUpHistory), http.MethodGet, http.MethodDelete))
	defer func() {
		h.UserSeeder.Down(idUser, idProfile)
		server.Close()
	}()
	req, _ := http.NewRequest(http.MethodDelete, server.URL+fmt.Sprintf("/topup?userid=%d", idUser), http.NoBody)
	client := &http.Client{}
	resp, _ := client.Do(req)

	actualResp := &dto.APIResponse[interface{}]{}
	bodyBytes, _ := io.ReadAll(resp.Body)
	json.Unmarshal(bodyBytes, actualResp)
	_, errFind1 := h.Seeder.TopUpSeeder.FindById(int(idTopup1), int(idUser))
	_, errFind2 := h.Seeder.TopUpSeeder.FindById(int(idTopup2), int(idUser))

	assert.Equal(t, errFind1, sql.ErrNoRows)
	assert.Equal(t, errFind2, sql.ErrNoRows)
	assert.Equal(t, http.StatusOK, actualResp.StatusCode)
	assert.Equal(t, "Successfully deleted", actualResp.Message)
}

func (h *HistoryTest) DeleteAllHistoryTopUpWithEmptyData(t *testing.T) {
	t.Parallel()
	userMock := mock.NewUser1ProfileMock()
	idProfile, idUser := h.Seeder.UserSeeder.Up(userMock)
	server := httptest.NewServer(controller_http.MakeHTTPHandler(h.Controller.ExstractHeaderXUserData(h.Controller.HandleAllTopUpHistory), http.MethodGet, http.MethodDelete))
	defer func() {
		h.UserSeeder.Down(idUser, idProfile)
		server.Close()
	}()
	req, _ := http.NewRequest(http.MethodDelete, server.URL+fmt.Sprintf("/topup?userid=%d", idUser), http.NoBody)
	client := &http.Client{}
	resp, _ := client.Do(req)

	actualResp := &dto.APIResponse[interface{}]{}
	bodyBytes, _ := io.ReadAll(resp.Body)
	json.Unmarshal(bodyBytes, actualResp)

	assert.Equal(t, http.StatusOK, actualResp.StatusCode)
	assert.Equal(t, errors.ErrNothingToDel.Error(), actualResp.Message)
}
