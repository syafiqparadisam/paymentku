package mock

import "time"

type HistoryTopUp struct {
	UserId          int64
	Amount          uint
	Balance         int64
	Status          string
	PreviousBalance int64
	CreatedAt       string
}

type HistoryTransfer struct {
	UserId          int64
	Sender          string
	SenderName      string
	Receiver        string
	PreviousBalance int64
	ReceiverName    string
	Status          string
	Notes           string
	Amount          uint
	CreatedAt       string
}

func NewHistoryTransfer1(userid int64, user1 *Profile, user2 *Profile) *HistoryTransfer {
	return &HistoryTransfer{
		UserId:          userid,
		Sender:          user1.User,
		SenderName:      user1.Name,
		Receiver:        user2.User,
		ReceiverName:    user2.Name,
		PreviousBalance: user1.Balance,
		Status:          "SUCCESS",
		Notes:           "",
		Amount:          10000,
		CreatedAt:       time.Now().UTC().Format("2006-01-02T15:04:05.999Z"),
	}
}

func NewHistoryTransfer2(userid int64, user1 *Profile, user2 *Profile) *HistoryTransfer {
	return &HistoryTransfer{
		UserId:       userid,
		Sender:       user1.User,
		SenderName:   user1.Name,
		Receiver:     user2.User,
		PreviousBalance: user1.Balance,
		ReceiverName: user2.Name,
		Status:       "FAILED",
		Notes:        "",
		Amount:       1000,
		CreatedAt:    time.Now().UTC().Format("2006-01-02T15:04:05.999Z"),
	}
}

func NewHistoryTopUp1(user *Profile, userid int64) *HistoryTopUp {
	return &HistoryTopUp{
		UserId:          userid,
		Amount:          1000,
		Balance:         user.Balance + int64(1000),
		Status:          "SUCCESS",
		PreviousBalance: user.Balance,
		CreatedAt:       time.Now().UTC().Format("2006-01-02T15:04:05.999Z"),
	}
}

func NewHistoryTopUp2(user *Profile, userid int64) *HistoryTopUp {
	return &HistoryTopUp{
		UserId:          userid,
		Amount:          10000,
		Balance:         user.Balance + int64(10000),
		Status:          "FAILED",
		PreviousBalance: user.Balance,
		CreatedAt:       time.Now().UTC().Format("2006-01-02T15:04:05.999Z"),
	}
}
