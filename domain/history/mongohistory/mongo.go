package mongohistory

import (
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type TopUpStore struct {
	Db *mongo.Collection
}

type TransferStore struct {
	Db *mongo.Collection
}

type TopUpRepository interface {
	GetHistoryTopUpIdAndDateByUserId(int) (*[]TopUpIdAndDate, error)
	GetHistoryTopUpByIdWithUserId(int, *primitive.ObjectID) (*TopUpHistory, error)
}

type TransferRepository interface {
	GetHistoryTransferIdAndDateByUserId(int) (*[]TransferIdAndDate, error)
	GetHistoryTransferByIdWithUserId(int, *primitive.ObjectID) (*TransferHistory, error)
}

type TopUpIdAndDate struct {
	IdHistory primitive.ObjectID `bson:"_id" json:"historyId"`
	UserId    int                `bson:"userid" json:"userId"`
	CreatedAt string             `bson:"created_at" json:"createdAt"`
	IsRead    bool               `bson:"isRead" json:"isRead"`
	Amount    uint32             `bson:"amount" json:"amount"`
}

type TopUpHistory struct {
	IdHistory      primitive.ObjectID `bson:"_id" json:"historyId"`
	UserId         int                `bson:"userid" json:"userId"`
	CreatedAt      string             `bson:"created_at" json:"createdAt"`
	Uangsebelumnya uint64             `bson:"uang_sebelumnya" json:"uangSebelumnya"`
	Uangsetelahnya uint64             `bson:"uang_setelahnya" json:"uangSetelahnya"`
	Amount         uint32             `bson:"amount" json:"amount"`
	IsRead         bool               `bson:"isRead" json:"isRead"`
}

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

func (tp *TopUpStore) GetHistoryTopUpIdAndDateByUserId(id int) (*[]TopUpIdAndDate, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := tp.Db.Find(ctx, bson.D{{Key: "userid", Value: id}}, options.Find().SetProjection(bson.D{{Key: "userid", Value: 1}, {Key: "created_at", Value: 1}, {Key: "_id", Value: 1}, {Key: "isRead", Value: 1}, {Key: "amount", Value: 1}}).SetSort(bson.D{{Key: "created_at", Value: -1}}))
	if err != nil {
		return nil, err
	}
	fmt.Println("is error while find history", err)
	topUpidAndDate := []TopUpIdAndDate{}
	for result.Next(ctx) {
		field := TopUpIdAndDate{}
		if err := result.Decode(&field); err != nil {
			return nil, err
		}
		topUpidAndDate = append(topUpidAndDate, field)
	}
	if err := result.Err(); err != nil {
		return nil, err
	}
	return &topUpidAndDate, nil
}

func (tp *TopUpStore) GetHistoryTopUpByIdWithUserId(idUser int, idHistory *primitive.ObjectID) (*TopUpHistory, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	result := tp.Db.FindOne(ctx, bson.D{{Key: "userid", Value: idUser}, {Key: "_id", Value: idHistory}})
	if result.Err() != nil {
		return nil, result.Err()
	}
	topUpIdHistory := TopUpHistory{}
	err := result.Decode(&topUpIdHistory)
	if err != nil {
		return nil, err
	}
	return &topUpIdHistory, nil
}

func (tf *TransferStore) GetHistoryTransferIdAndDateByUserId(id int) (*[]TransferIdAndDate, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := tf.Db.Find(ctx, bson.D{{Key: "userid", Value: id}}, options.Find().SetProjection(bson.D{{Key: "userid", Value: 1}, {Key: "created_at", Value: 1}, {Key: "_id", Value: 1}, {Key: "isRead", Value: 1}, {Key: "amount", Value: 1}, {Key: "to", Value: 1}}).SetSort(bson.D{{Key: "created_at", Value: -1}}))
	if err != nil {
		return nil, err
	}
	fmt.Println("is error while find history", err)
	transferidAndDate := []TransferIdAndDate{}
	for result.Next(ctx) {
		field := TransferIdAndDate{}
		if err := result.Decode(&field); err != nil {
			return nil, err
		}
		transferidAndDate = append(transferidAndDate, field)
	}
	if err := result.Err(); err != nil {
		return nil, err
	}
	return &transferidAndDate, nil
}

func (tp *TransferStore) GetHistoryTransferByIdWithUserId(idUser int, idHistory *primitive.ObjectID) (*TransferHistory, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	result := tp.Db.FindOne(ctx, bson.D{{Key: "userid", Value: idUser}, {Key: "_id", Value: idHistory}})
	if result.Err() != nil {
		return nil, result.Err()
	}
	transferIdHistory := TransferHistory{}
	err := result.Decode(&transferIdHistory)
	if err != nil {
		return nil, err
	}
	return &transferIdHistory, nil
}
