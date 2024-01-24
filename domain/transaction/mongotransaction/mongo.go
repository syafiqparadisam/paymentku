package mongotransaction

import (
	"context"
	"fmt"
	"time"

	"github.com/syafiqparadisam/paymentku/domain/transaction/dtotransaction"
	"github.com/syafiqparadisam/paymentku/entity"
	"go.mongodb.org/mongo-driver/mongo"
)

type TopUpRepository interface {
	InsertTopUpHistory(*TopUpInfo) error
}

type TransferRepository interface {
	InsertTransferHistory(*TransferInfo) error
}

type MongoRepository struct {
	db *mongo.Database
}

type TopUpStore struct {
	coll *mongo.Collection
}
type TransferStore struct {
	coll *mongo.Collection
}

type TopUpInfo struct {
	History   *entity.History
	Dto       dtotransaction.TopUpRequest
	LastMoney *entity.MoneyBefore
	Balance   *entity.Bank
}

type TransferInfo struct {
	History     *entity.History
	Destination *entity.Destination
	Dto         dtotransaction.TransferRequest
	Money       *entity.MoneyAfter
}

func (t *TransferStore) InsertTransferHistory(payload *TransferInfo) error {
	ctx, cancel := context.WithTimeout(context.Background(), 4*time.Second)
	defer cancel()
	result, err := t.coll.InsertOne(ctx, struct {
		UserId         int
		To             string
		Notes          string
		CreatedAt      string
		ToAccount      int64
		Amount         uint32
		RemainingMoney uint64
		IsRead         bool
	}{
		UserId:         payload.History.UserId,
		To:             payload.Destination.To,
		Notes:          payload.Dto.Catatan,
		CreatedAt:      payload.History.CreatedAt,
		ToAccount:      payload.Dto.AccountNumber,
		Amount:         payload.Dto.Nominal,
		RemainingMoney: payload.Money.After,
		IsRead:         payload.History.IsRead,
	})
	if result.InsertedID == nil {
		return fmt.Errorf("No content modified")
	}
	if err != nil {
		return err
	}
	return nil
}

func (m *TopUpStore) InsertTopUpHistory(payload *TopUpInfo) error {
	ctx, cancel := context.WithTimeout(context.Background(), 4*time.Second)
	defer cancel()
	fmt.Println(payload)
	result, err := m.coll.InsertOne(ctx, struct {
		UserId    int
		Amount    uint32
		CreatedAt string
		LastMoney uint64
		Balance   uint64
		IsRead    bool
	}{
		UserId:    payload.History.UserId,
		Amount:    payload.Dto.Amount,
		CreatedAt: payload.History.CreatedAt,
		LastMoney: payload.LastMoney.Before,
		Balance:   payload.Balance.Balance,
		IsRead:    payload.History.IsRead,
	})

	if result.InsertedID == nil {
		return fmt.Errorf("No content modified")
	}
	fmt.Println("inserted field")
	if err != nil {
		return err
	}
	return nil
}
