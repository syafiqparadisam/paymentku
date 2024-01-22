package db

import "go.mongodb.org/mongo-driver/bson/primitive"

type TopUpIdAndDate struct {
	IdHistory primitive.ObjectID `bson:"_id" json:"historyId"`
	UserId    int                `bson:"userid" json:"userId"`
	CreatedAt string             `bson:"created_at" json:"createdAt"`
	IsRead    bool               `bson:"isRead" json:"isRead"`
	Amount    uint32             `bson:"amount" json:"amount"`
}

type TopUpHistory struct {
	IdHistory       primitive.ObjectID `bson:"_id" json:"historyId"`
	UserId          int                `bson:"userid" json:"userId"`
	CreatedAt       string             `bson:"created_at" json:"createdAt"`
	Uangsebelumnya uint64             `bson:"uang_sebelumnya" json:"uangSebelumnya"`
	Uangsetelahnya uint64             `bson:"uang_setelahnya" json:"uangSetelahnya"`
	Amount          uint32             `bson:"amount" json:"amount"`
	IsRead          bool               `bson:"isRead" json:"isRead"`
}
