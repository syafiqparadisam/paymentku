package controller_http

import (
	"net/http"
	"strconv"

	"github.com/syafiqparadisam/paymentku/services/history/dto"
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
	idparams := r.PathValue("id")
	id, _ := strconv.Atoi(idparams)
	result := c.usecase.GetHistoryTransferById(user, id)
	return WriteJSON(w, result.StatusCode, result)
}

func (c *ControllerHTTP) DeleteTransferHistoryById(w http.ResponseWriter, r *http.Request, user *dto.XUserData) error {
	idparams := r.PathValue("id")
	id, _ := strconv.Atoi(idparams)
	result := c.usecase.DeleteHistoryTransferById(user, id)
	return WriteJSON(w, result.StatusCode, result)
}

func (s *ControllerHTTP) GetAllTransferHistory(w http.ResponseWriter, r *http.Request, user *dto.XUserData) error {
	result := s.usecase.GetAllHistoryTransfer(user)
	return WriteJSON(w, result.StatusCode, result)
}

func (s *ControllerHTTP) DeleteAllTransferHistory(w http.ResponseWriter, r *http.Request, user *dto.XUserData) error {
	result := s.usecase.DeleteAllHistoryTransfer(user)
	return WriteJSON(w, result.StatusCode, result)
}
