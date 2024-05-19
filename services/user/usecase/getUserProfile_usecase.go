package usecase

import (
	"context"
	"database/sql"
	"net/http"
	"strconv"

	"github.com/syafiqparadisam/paymentku/services/user/domain"
	"github.com/syafiqparadisam/paymentku/services/user/dto"
	"github.com/syafiqparadisam/paymentku/services/user/errors"
	"go.opentelemetry.io/otel"
)

func (s *Usecase) GetUserProfile(userid string) dto.APIResponse[*domain.Profile] {
	ctx := context.Background()
	tracer := otel.GetTracerProvider()
	ctx, span := tracer.Tracer("github.com/syafiqparadisam/paymentku/services/user/usecase").Start(ctx, "get User Profile")
	defer func() {
		span.End()
	}()

	userId, _ := strconv.Atoi(userid)
	result, err := s.User.GetProfile(ctx, userId)
	if err != nil {
		panic(err)
	}
	return dto.APIResponse[*domain.Profile]{StatusCode: http.StatusOK, Data: result, Message: "Ok"}
}

func (s *Usecase) GetUserProfileByAccNumber(payload *dto.FindUserByAccNumber) dto.APIResponse[*domain.ProfileForFindWithAccount] {

	result, err := s.User.GetUserProfileByAccNumber(payload.AccountNumber)
	if err == sql.ErrNoRows {
		return dto.APIResponse[*domain.ProfileForFindWithAccount]{StatusCode: http.StatusNotFound, Message: errors.ErrUserNoRows.Error()}
	}
	if err != nil {
		panic(err)
	}
	return dto.APIResponse[*domain.ProfileForFindWithAccount]{StatusCode: http.StatusOK, Data: result, Message: "Ok"}
}
