package domain

import "time"

type HistoryTopUp struct {
	UserId          int
	Amount          uint
	Balance         int64
	Status          string
	PreviousBalance int64
	CreatedAt       string
}

type HistoryTransfer struct {
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

func NewHistoryTransfer(userid int, sender string, senderName, receiver string, receiverName, status, notes string, amount uint, prevBalance, balance int64) *HistoryTransfer {
	return &HistoryTransfer{
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

func NewHistoryTopUp(amount uint, balance int64, status string, userid int) *HistoryTopUp {
	return &HistoryTopUp{
		UserId:          userid,
		Amount:          amount,
		Balance:         balance + int64(amount),
		Status:          status,
		PreviousBalance: balance,
		CreatedAt:       time.Now().UTC().Format("2006-01-02T15:04:05.999Z"),
	}
}
