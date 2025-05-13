package dto

type XUserData struct {
	UserId string `json:"user_id"`
}

type TopUpRequest struct {
	Amount uint `json:"amount" required:"true"`
}

type TransferRequest struct {
	AccountNumber uint64 `json:"accountNumber" required:"true"`
	Notes         string `json:"notes"`
	Amount        uint   `json:"amount" required:"true"`
}