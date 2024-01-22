package handlers

import (
	"fmt"
	"historyservice/middleware"
	"historyservice/utils"
	"net/http"
	
)

func (s *Server) handleTransferHistory(w http.ResponseWriter, r *http.Request, decode *middleware.UserJwtDecode) error {
	if r.Method == "GET" {

		// find id from this user
		userId, errFindId := s.Sql.FindIdByName(decode.User)
		if errFindId != nil {
			return utils.WriteJSON(w, http.StatusBadRequest, APIErrMessage{StatusCode: http.StatusBadRequest, Error: errFindId.Error()})
		}

		// take all history transfer from this user
		arrHistoryTransfer, err := s.Transfer.GetHistoryTransferIdAndDateByUserId(userId.Id)
		if err != nil {
			return utils.WriteJSON(w, http.StatusBadRequest, APIErrMessage{StatusCode: http.StatusBadRequest, Error: err.Error()})
		}
		return utils.WriteJSON(w, http.StatusOK, APIResponse{StatusCode: http.StatusOK, Data: arrHistoryTransfer, Message: "Ok"})
	} else {
		return utils.WriteJSON(w, http.StatusBadRequest, APIErrMessage{Error: "Method not allowed"})
	}
}

func (s *Server) handleTransferHistoryById(w http.ResponseWriter, r *http.Request, decode *middleware.UserJwtDecode) error {
	if r.Method == "GET" {
		
		idHistory,errParseUrl := utils.ParseURlParamsToObjectId(r.URL.Path)
		if errParseUrl != nil {
			return utils.WriteJSON(w, http.StatusBadRequest, APIErrMessage{StatusCode: http.StatusBadRequest, Error: errParseUrl.Error()})
		}
		// find id from this user
		userId, errFindId := s.Sql.FindIdByName(decode.User)
		if errFindId != nil {
			return utils.WriteJSON(w, http.StatusBadRequest, APIErrMessage{Error: errFindId.Error()})
		}
		arrHistoryTransfer, err := s.Transfer.GetHistoryTransferByIdWithUserId(userId.Id, idHistory)
		fmt.Println(arrHistoryTransfer, err)
		if err != nil {
			return utils.WriteJSON(w, http.StatusNotFound, APIErrMessage{StatusCode: http.StatusNotFound, Error: err.Error()})
		}

		return utils.WriteJSON(w, http.StatusOK, APIResponse{StatusCode: http.StatusOK, Data: arrHistoryTransfer, Message: "Ok"})
	} else {
		return utils.WriteJSON(w, http.StatusBadRequest, APIErrMessage{StatusCode: http.StatusBadRequest, Error: "Method not allowed"})
	}
}
