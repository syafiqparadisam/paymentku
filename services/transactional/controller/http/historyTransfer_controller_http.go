package controller_http

import (
	"context"
	"net/http"
	"time"

	"github.com/syafiqparadisam/paymentku/services/transactional/dto"
)

func (c *ControllerHTTP) HandleTransferHistoryById(w http.ResponseWriter, r *http.Request, user *dto.XUserData) error {
	if r.Method == "GET" {
		return c.GetTransferHistoryById(w, r, user)
	}

	if r.Method == "DELETE" {
		return c.DeleteTransferHistoryById(w, r, user)
	}
	return nil
}

func (c *ControllerHTTP) HandleAllTransferHistory(w http.ResponseWriter, r *http.Request, user *dto.XUserData) error {
	if r.Method == "GET" {
		return c.GetAllTransferHistory(w, r, user)
	}

	if r.Method == "DELETE" {
		return c.DeleteAllTransferHistory(w, r, user)
	}
	return nil
}

func (c *ControllerHTTP) GetTransferHistoryById(w http.ResponseWriter, r *http.Request, user *dto.XUserData) error {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	

	id, err := ExtractIDFromPath(r, "/history/transfer/")
	if err != nil {
		return WriteJSON(w, http.StatusBadRequest, &dto.APIResponse[interface{}]{StatusCode: http.StatusBadRequest, Message: "Invalid history id"})
	}
	result := c.usecase.GetHistoryTransferById(ctx, user, id)
	return WriteJSON(w, result.StatusCode, result)
}

func (c *ControllerHTTP) DeleteTransferHistoryById(w http.ResponseWriter, r *http.Request, user *dto.XUserData) error {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	
	id, err := ExtractIDFromPath(r, "/history/transfer/")
	if err != nil {
		return WriteJSON(w, http.StatusBadRequest, &dto.APIResponse[interface{}]{StatusCode: http.StatusBadRequest, Message: "Invalid history id"})
	}
	result := c.usecase.DeleteHistoryTransferById(ctx, user, id)
	return WriteJSON(w, result.StatusCode, result)
}

func (s *ControllerHTTP) GetAllTransferHistory(w http.ResponseWriter, r *http.Request, user *dto.XUserData) error {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	result := s.usecase.GetAllHistoryTransfer(ctx, user)
	return WriteJSON(w, result.StatusCode, result)
}

func (s *ControllerHTTP) DeleteAllTransferHistory(w http.ResponseWriter, r *http.Request, user *dto.XUserData) error {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	
	result := s.usecase.DeleteAllHistoryTransfer(ctx, user)
	return WriteJSON(w, result.StatusCode, result)
}
