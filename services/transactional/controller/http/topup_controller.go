package controller_http

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/syafiqparadisam/paymentku/services/transactional/dto"
	"go.opentelemetry.io/otel"
)

func (s *ControllerHTTP) HandlerTopUp(w http.ResponseWriter, r *http.Request, user *dto.XUserData) error {
	topUpReq := &dto.TopUpRequest{}
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	tracer := otel.GetTracerProvider()
	ctx, span := tracer.Tracer("github.com/syafiqparadisam/paymentku/services/transactional/controller/http").Start(ctx, "create topup")
	defer span.End()
	if err := json.NewDecoder(r.Body).Decode(topUpReq); err != nil {
		return WriteJSON(w, http.StatusBadRequest, dto.APIResponse[interface{}]{StatusCode: http.StatusBadRequest, Message: "Invalid input format"})
	}
	fmt.Println(topUpReq.Amount)

	result := s.usecase.InsertHistoryTopUp(ctx, topUpReq, user)
	if result.StatusCode != http.StatusOK {
		return WriteJSON(w, result.StatusCode, result)
	}

	return WriteJSON(w, result.StatusCode, dto.APIResponse[interface{}]{StatusCode: result.StatusCode, Message: "succesfully topup"})

}
