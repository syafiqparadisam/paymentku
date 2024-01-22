package db

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TransferIdAndDate struct {
	HistoryId primitive.ObjectID `bson:"_id" json:"historyId"`
	UserId    int                `bson:"userid" json:"userId"`
	CreatedAt string             `bson:"created_at" json:"createdAt"`
	To        string             `bson:"to" json:"to"`
	Amount    uint32             `bson:"amount" json:"amount"`
	IsRead    bool               `bson:"isRead" json:"isRead"`
}

type TransferHistory struct {
	HistoryId      primitive.ObjectID `bson:"_id" json:"historyId"`
	UserId         int                `bson:"userid" json:"userId"`
	CreatedAt      string             `bson:"created_at" json:"createdAt"`
	To             string             `bson:"to" json:"to"`
	ToAccount      int64              `bson:"to_account" json:"toAccount"`
	Notes          string             `bson:"notes" json:"notes"`
	RemainingMoney uint64             `bson:"remaining_money" json:"remainingMoney"`
	Amount         uint32             `bson:"amount" json:"amount"`
	IsRead         bool               `bson:"isRead" json:"isRead"`
}
