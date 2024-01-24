package providerhistory

import (
	"fmt"
	"net/http"

	"github.com/syafiqparadisam/paymentku/shared"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (s *Provider) GetAllTopUpHistory(decode *shared.UserJwtDecode) shared.APIResponse {

	fmt.Println(decode.User, decode.Email)
	// find id from this user
	userId, errFindId := s.Sql.FindIdByName(decode.User)
	if errFindId != nil {
		return shared.APIResponse{StatusCode: http.StatusBadRequest, Error: errFindId.Error()}
	}

	// take all history but return id and createdAt
	arrHistoryTopUp, err := s.TopUp.GetHistoryTopUpIdAndDateByUserId(userId.Id)
	if err != nil {
		return shared.APIResponse{StatusCode: http.StatusBadRequest, Error: err.Error()}
	}

	return shared.APIResponse{StatusCode: http.StatusOK, Data: arrHistoryTopUp, Message: "Ok"}
}

func (s *Provider) GetAllTopUpHistoryByIdHistory(idHistory *primitive.ObjectID, decode *shared.UserJwtDecode) shared.APIResponse {
	userId, errFindId := s.Sql.FindIdByName(decode.User)
	if errFindId != nil {
		return shared.APIResponse{Error: errFindId.Error()}
	}
	arrHistoryTopUp, err := s.TopUp.GetHistoryTopUpByIdWithUserId(userId.Id, idHistory)
	fmt.Println(arrHistoryTopUp, err)
	if err != nil {
		return shared.APIResponse{StatusCode: http.StatusNotFound, Error: err.Error()}
	}

	return shared.APIResponse{StatusCode: http.StatusOK, Data: arrHistoryTopUp, Message: "Ok"}
}
