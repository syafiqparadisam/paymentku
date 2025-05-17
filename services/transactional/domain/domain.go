package domain

import "time"

type GetHistoryTopUpById struct {
	Id              int    `json:"id"`
	Amount          uint   `json:"amount"`
	Balance         int64  `json:"balance"`
	PreviousBalance int64  `json:"previousBalance"`
	IsRead          bool   `json:"isRead"`
	Status          string `json:"status"`
	CreatedAt       string `json:"createdAt"`
}

type GetHistoryTopUpForGetAll struct {
	Id        int    `json:"id"`
	Amount    uint   `json:"amount"`
	IsRead    bool   `json:"isRead"`
	Status    string `json:"status"`
	CreatedAt string `json:"createdAt"`
}

type GetHistoryTransfers struct {
	Id        int    `json:"id"`
	Sender    string `json:"sender"`
	Receiver  string `json:"receiver"`
	Amount    uint   `json:"amount"`
	IsRead    bool   `json:"isRead"`
	Status    string `json:"status"`
	CreatedAt string `json:"createdAt"`
}

type GetHistoryTransferById struct {
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

type CreateHistoryTopUp struct {
	UserId          int
	Amount          uint
	Balance         int64
	Status          string
	PreviousBalance int64
	CreatedAt       string
}

type CreateHistoryTransfer struct {
	UserId          int
	Sender          string
	SenderName      string
	Receiver        string
	ReceiverName    string
	Status          string
	Notes           string
	Amount          uint
	Balance         int64
	PreviousBalance int64
	CreatedAt       string
}

func NewHistoryTransfer(userid int, sender string, senderName, receiver string, receiverName, status, notes string, amount uint, prevBalance, balance int64) *CreateHistoryTransfer {
	return &CreateHistoryTransfer{
		UserId:          userid,
		Sender:          sender,
		SenderName:      senderName,
		Receiver:        receiver,
		ReceiverName:    receiverName,
		PreviousBalance: prevBalance,
		Balance:         balance,
		Status:          status,
		Notes:           notes,
		Amount:          amount,
		CreatedAt:       time.Now().UTC().Format("2006-01-02T15:04:05.999Z"),
	}
}

func NewHistoryTopUp(amount uint, balance int64, prevBalance int64, status string, userid int) *CreateHistoryTopUp {
	return &CreateHistoryTopUp{
		UserId:          userid,
		Amount:          amount,
		Balance:         balance,
		Status:          status,
		PreviousBalance: prevBalance,
		CreatedAt:       time.Now().UTC().Format("2006-01-02T15:04:05.999Z"),
	}
}
