package handlers

import (
	"fmt"
	"historyservice/middleware"
	"historyservice/utils"
	"net/http"
)

func (s *Server) handleTopUpHistory(w http.ResponseWriter, r *http.Request, decode *middleware.UserJwtDecode) error {

	if r.Method == "GET" {

		fmt.Println(decode.User, decode.Email)
		// find id from this user
		userId, errFindId := s.Sql.FindIdByName(decode.User)
		if errFindId != nil {
			return utils.WriteJSON(w, http.StatusBadRequest, APIErrMessage{Error: errFindId.Error()})
		}

		// take all history but return id and createdAt
		arrHistoryTopUp, err := s.Topup.GetHistoryTopUpIdAndDateByUserId(userId.Id)
		if err != nil {
			return utils.WriteJSON(w, http.StatusBadRequest, APIErrMessage{StatusCode: http.StatusBadRequest, Error: err.Error()})
		}

		return utils.WriteJSON(w, http.StatusOK, APIResponse{StatusCode: http.StatusOK, Data: arrHistoryTopUp, Message: "Ok"})
	} else {
		return utils.WriteJSON(w, http.StatusBadRequest, APIErrMessage{Error: fmt.Errorf("Method not allowed").Error()})
	}
}

func (s *Server) handleTopUpHistoryById(w http.ResponseWriter, r *http.Request, decode *middleware.UserJwtDecode) error {
	if r.Method == "GET" {

		idHistory, errParseUrl := utils.ParseURlParamsToObjectId(r.URL.Path)
		if errParseUrl != nil {
			return utils.WriteJSON(w, http.StatusBadRequest, APIErrMessage{StatusCode: http.StatusBadRequest, Error: errParseUrl.Error()})
		}
		// find id from this user
		userId, errFindId := s.Sql.FindIdByName(decode.User)
		if errFindId != nil {
			return utils.WriteJSON(w, http.StatusBadRequest, APIErrMessage{Error: errFindId.Error()})
		}
		arrHistoryTopUp, err := s.Topup.GetHistoryTopUpByIdWithUserId(userId.Id, idHistory)
		fmt.Println(arrHistoryTopUp, err)
		if err != nil {
			return utils.WriteJSON(w, http.StatusNotFound, APIErrMessage{StatusCode: http.StatusNotFound, Error: err.Error()})
		}

		return utils.WriteJSON(w, http.StatusOK, APIResponse{StatusCode: http.StatusOK, Data: arrHistoryTopUp, Message: "Ok"})
	} else {
		return utils.WriteJSON(w, http.StatusBadRequest, APIErrMessage{StatusCode: http.StatusBadRequest, Error: "Method not allowed"})
	}
}
