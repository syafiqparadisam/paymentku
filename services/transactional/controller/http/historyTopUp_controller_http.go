package controller_http

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/syafiqparadisam/paymentku/services/transactional/dto"
	"github.com/syafiqparadisam/paymentku/services/transactional/errors"
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
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	id, err := ExtractIDFromPath(r, "/history/topup/")

	if err != nil {
		return WriteJSON(w, http.StatusBadRequest, &dto.APIResponse[interface{}]{StatusCode: http.StatusBadRequest, Message: "Invalid history id"})
	}

	result := c.usecase.GetHistoryTopUpById(ctx, user, id)
	return WriteJSON(w, result.StatusCode, result)
}

func (c *ControllerHTTP) DeleteTopUpHistoryById(w http.ResponseWriter, r *http.Request, user *dto.XUserData) error {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	id, err := ExtractIDFromPath(r, "/history/topup/")
	if err != nil {
		return WriteJSON(w, http.StatusBadRequest, &dto.APIResponse[interface{}]{StatusCode: http.StatusBadRequest, Message: "Invalid history id"})
	}
	result := c.usecase.DeleteHistoryTopUpById(ctx, user, id)
	return WriteJSON(w, result.StatusCode, result)
}

func (s *ControllerHTTP) GetAllTopUpHistory(w http.ResponseWriter, r *http.Request, user *dto.XUserData) error {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	result := s.usecase.GetAllHistoryTopUp(ctx, user)
	fmt.Println(user.UserId)
	return WriteJSON(w, result.StatusCode, result)
}

func (s *ControllerHTTP) DeleteAllTopUpHistory(w http.ResponseWriter, r *http.Request, user *dto.XUserData) error {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	result := s.usecase.DeleteAllHistoryTopUp(ctx, user)
	fmt.Println(result)
	return WriteJSON(w, result.StatusCode, result)
}
