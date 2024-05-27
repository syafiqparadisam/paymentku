package controller_http

import (
	"fmt"
	"net/http"

	"github.com/syafiqparadisam/paymentku/services/history/dto"
	"github.com/syafiqparadisam/paymentku/services/history/errors"
)

func (c *ControllerHTTP) HandleTopUpHistoryById(w http.ResponseWriter, r *http.Request, user *dto.XUserData) error {
	if r.Method == "GET" {
		return c.GetTopUpHistoryById(w, r, user)
	}
	if r.Method == "DELETE" {
		return c.DeleteTopUpHistoryById(w, r, user)
	}
	return errors.ErrMethodNotAllowed
}

func (c *ControllerHTTP) HandleAllTopUpHistory(w http.ResponseWriter, r *http.Request, user *dto.XUserData) error {
	if r.Method == "GET" {
		return c.GetAllTopUpHistory(w, r, user)
	}
	if r.Method == "DELETE" {
		return c.DeleteAllTopUpHistory(w, r, user)
	}
	return errors.ErrMethodNotAllowed
}

func (c *ControllerHTTP) GetTopUpHistoryById(w http.ResponseWriter, r *http.Request, user *dto.XUserData) error {
	id, err := ExtractIDFromPath(r, "/topup/")
	if err != nil {
		return WriteJSON(w, http.StatusBadRequest, &dto.APIResponse[interface{}]{StatusCode: http.StatusBadRequest, Message: "Invalid history id"})
	}

	result := c.usecase.GetHistoryTopUpById(user, id)
	return WriteJSON(w, result.StatusCode, result)
}

func (c *ControllerHTTP) DeleteTopUpHistoryById(w http.ResponseWriter, r *http.Request, user *dto.XUserData) error {
	id, err := ExtractIDFromPath(r, "/topup/")
	if err != nil {
		return WriteJSON(w, http.StatusBadRequest, &dto.APIResponse[interface{}]{StatusCode: http.StatusBadRequest, Message: "Invalid history id"})
	}
	result := c.usecase.DeleteHistoryTopUpById(user, id)
	return WriteJSON(w, result.StatusCode, result)
}

func (s *ControllerHTTP) GetAllTopUpHistory(w http.ResponseWriter, r *http.Request, user *dto.XUserData) error {
	result := s.usecase.GetAllHistoryTopUp(user)
	fmt.Println(user.UserId)
	return WriteJSON(w, result.StatusCode, result)
}

func (s *ControllerHTTP) DeleteAllTopUpHistory(w http.ResponseWriter, r *http.Request, user *dto.XUserData) error {
	result := s.usecase.DeleteAllHistoryTopUp(user)
	fmt.Println(result)
	return WriteJSON(w, result.StatusCode, result)
}
