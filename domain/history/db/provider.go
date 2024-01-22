package db

import (
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type TopUpProvider interface {
	GetHistoryTopUpIdAndDateByUserId(int) (*[]TopUpIdAndDate, error)
	GetHistoryTopUpByIdWithUserId(int, *primitive.ObjectID) (*TopUpHistory, error)
}

type TransferProvider interface {
	GetHistoryTransferIdAndDateByUserId(int) (*[]TransferIdAndDate, error)
	GetHistoryTransferByIdWithUserId(int, *primitive.ObjectID) (*TransferHistory, error)
}

type MySqlProvider interface {
	FindIdByName(string) (*UserId, error)
}

func (s *MySqlStore) FindIdByName(user string) (*UserId, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	query := fmt.Sprintf("select id from users where user = '%s'", user)
	rows, err := s.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	userId := &UserId{}
	if rows.Next() {
		if err := rows.Scan(&userId.Id); err != nil {
			return nil, err
		}
		return userId, nil
	}
	return nil, fmt.Errorf("can't scanning rows")
}

func (tp *MongoTopUpStore) GetHistoryTopUpIdAndDateByUserId(id int) (*[]TopUpIdAndDate, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := tp.db.Find(ctx, bson.D{{Key: "userid", Value: id}}, options.Find().SetProjection(bson.D{{Key: "userid", Value: 1}, {Key: "created_at", Value: 1}, {Key: "_id", Value: 1}, {Key: "isRead", Value: 1}, {Key: "amount", Value: 1}}).SetSort(bson.D{{Key: "created_at", Value: -1}}))
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

func (tp *MongoTopUpStore) GetHistoryTopUpByIdWithUserId(idUser int, idHistory *primitive.ObjectID) (*TopUpHistory, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	result := tp.db.FindOne(ctx, bson.D{{Key: "userid", Value: idUser}, {Key: "_id", Value: idHistory}})
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

func (tf *MongoTransferStore) GetHistoryTransferIdAndDateByUserId(id int) (*[]TransferIdAndDate, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := tf.db.Find(ctx, bson.D{{Key: "userid", Value: id}}, options.Find().SetProjection(bson.D{{Key: "userid", Value: 1}, {Key: "created_at", Value: 1}, {Key: "_id", Value: 1}, {Key: "isRead", Value: 1}, {Key: "amount", Value: 1}, {Key: "to", Value: 1}}).SetSort(bson.D{{Key: "created_at", Value: -1}}))
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

func (tp *MongoTransferStore) GetHistoryTransferByIdWithUserId(idUser int, idHistory *primitive.ObjectID) (*TransferHistory, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	result := tp.db.FindOne(ctx, bson.D{{Key: "userid", Value: idUser}, {Key: "_id", Value: idHistory}})
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
