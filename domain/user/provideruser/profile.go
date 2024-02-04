package provideruser

import (
	"net/http"

	"github.com/syafiqparadisam/paymentku/shared"
)

func (s *Provider) GetUserProfile(usr, email string) shared.APIResponse {
	result, err := s.Sql.GetProfile(usr, email)
	if err != nil {
		return shared.APIResponse{StatusCode: http.StatusBadRequest, Error: err.Error()}
	}
	return shared.APIResponse{StatusCode: http.StatusOK, Data: result, Message: "OK"}
}
