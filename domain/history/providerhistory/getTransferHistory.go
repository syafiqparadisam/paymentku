package providerhistory

import (
	"fmt"
	"net/http"

	"github.com/syafiqparadisam/paymentku/shared"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (s *Provider) GetAllTransferHistory(decode *shared.UserJwtDecode) shared.APIResponse {
	userId, errFindId := s.Sql.FindIdByName(decode.User)
	if errFindId != nil {
		return shared.APIResponse{StatusCode: http.StatusBadRequest, Error: errFindId.Error()}
	}

	// take all history transfer from this user
	arrHistoryTransfer, err := s.Transfer.GetHistoryTransferIdAndDateByUserId(userId.Id)
	if err != nil {
		return shared.APIResponse{StatusCode: http.StatusBadRequest, Error: err.Error()}
	}
	return shared.APIResponse{StatusCode: http.StatusOK, Data: arrHistoryTransfer, Message: "Ok"}
}

func (s *Provider) GetAllTransferHistoryByIdHistory(idHistory *primitive.ObjectID, decode *shared.UserJwtDecode) shared.APIResponse {
	// find id from this user
	userId, errFindId := s.Sql.FindIdByName(decode.User)
	if errFindId != nil {
		return shared.APIResponse{Error: errFindId.Error()}
	}
	arrHistoryTransfer, err := s.Transfer.GetHistoryTransferByIdWithUserId(userId.Id, idHistory)
	fmt.Println(arrHistoryTransfer, err)
	if err != nil {
		return shared.APIResponse{StatusCode: http.StatusNotFound, Error: err.Error()}
	}

	return shared.APIResponse{StatusCode: http.StatusOK, Data: arrHistoryTransfer, Message: "Ok"}
}
