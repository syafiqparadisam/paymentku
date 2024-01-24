package dtotransaction

type TopUpRequest struct {
	Amount uint32 `json:"nominal"`
}

type TransferRequest struct {
	AccountNumber int64 `json:"accountnumber"`
	Catatan string `json:"catatan"`
	Nominal uint32 `json:"nominal"`
}

type FindUserRequest struct {
	AccountNumber int64 `json:"accountnumber"`
}