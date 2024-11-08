package domain

type HistoryTopUp struct {
	Id              int    `json:"id"`
	Amount          uint   `json:"amount"`
	Balance         int64  `json:"balance"`
	PreviousBalance int64  `json:"previousBalance"`
	IsRead          bool   `json:"isRead"`
	Status          string `json:"status"`
	CreatedAt       string `json:"createdAt"`
}

type HistoryTopUpForGetAll struct {
	Id        int    `json:"id"`
	Amount    uint   `json:"amount"`
	IsRead    bool   `json:"isRead"`
	Status    string `json:"status"`
	CreatedAt string `json:"createdAt"`
}

type HistoryTransferForGetAll struct {
	Id        int    `json:"id"`
	Sender    string `json:"sender"`
	Receiver  string `json:"receiver"`
	Amount    uint   `json:"amount"`
	IsRead    bool   `json:"isRead"`
	Status    string `json:"status"`
	CreatedAt string `json:"createdAt"`
}

type HistoryTransfer struct {
	Id              int     `json:"id"`
	Sender          string  `json:"sender"`
	Receiver        string  `json:"receiver"`
	Notes           *string `json:"notes"`
	Amount          uint    `json:"amount"`
	IsRead          bool    `json:"isRead"`
	Status          string  `json:"status"`
	SenderName      string  `json:"senderName"`
	PreviousBalance int64   `json:"previousBalance"`
	Balance         int64   `json:"balance"`
	ReceiverName    string  `json:"receiverName"`
	CreatedAt       string  `json:"createdAt"`
}
