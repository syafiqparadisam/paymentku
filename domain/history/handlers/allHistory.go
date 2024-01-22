package handlers

import (
	"historyservice/middleware"
	"historyservice/utils"
	"net/http"
	"time"
)

func (s *Server) handleAllHistory(w http.ResponseWriter, r *http.Request, decode *middleware.UserJwtDecode) error {
	if r.Method == "GET" {
		_, errFindId := s.Sql.FindIdByName(decode.User)
		if errFindId != nil {
			return utils.WriteJSON(w, http.StatusBadRequest, APIErrMessage{Error: errFindId.Error()})
		}
		// arrAllHistory := []interface{}{}
		// get topup history
		// arrTopUpHistory, errTopUpHistory := s.Topup.GetHistoryTopUpIdAndDateByUserId(userId.Id)
		// if errTopUpHistory != nil {
		// 	return utils.WriteJSON(w, http.StatusBadRequest, APIErrMessage{StatusCode: http.StatusBadRequest, Error: errTopUpHistory.Error()})
		// }
		// // get transfer history
		// arrTransferHistory, errTransferHistory := s.Transfer.GetHistoryTransferIdAndDateByUserId(userId.Id)
		// if errTransferHistory != nil {
		// 	return utils.WriteJSON(w, http.StatusBadRequest, APIErrMessage{StatusCode: http.StatusBadRequest, Error: errTransferHistory.Error()})
		// }
		// for _, each := range *arrTopUpHistory {
		// 	arrAllHistory = append(arrAllHistory, each)
		// }
		// for _, each := range *arrTransferHistory {
		// 	arrAllHistory = append(arrAllHistory, each)
		// }
		// // sort by createdAt
		// sort.Slice(arrAllHistory, func(i, j int) bool {
		// 	// 	// Convert string to time.Time for comparison
		// 	createdAtI, _ := customTimeParse(arrAllHistory[i].(interface{ CreatedAt() string }).CreatedAt)
		// 	createdAtJ, _ := customTimeParse(arrAllHistory[j].(interface{ CreatedAt() string }).CreatedAt)

		// 	return createdAtI.Before(createdAtJ)
		// })
		// fmt.Println(arrAllHistory)
		// return utils.WriteJSON(w, http.StatusBadRequest, APIResponse{StatusCode: http.StatusBadRequest, Data: arrAllHistory, Message: "Ok"})
		return nil
	}
	return utils.WriteJSON(w, http.StatusBadRequest, APIErrMessage{Error: "Method not allowed"})
}

func customTimeParse(timeStr string) (time.Time, error) {
	return time.Parse("2006-01-02 15:04", timeStr)
}
