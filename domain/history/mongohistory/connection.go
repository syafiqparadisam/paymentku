package mongohistory

import (
	"context"
	"fmt"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func NewMongoDBStore() (*mongo.Database, error) {
	pass := os.Getenv("PASS_MONGO")
	uri := fmt.Sprintf("mongodb+srv://mongotutorial:%s@cluster0.u6antwt.mongodb.net/?retryWrites=true&w=majority", pass)

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	clientOptions := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return nil, err
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		return nil, err
	}
	fmt.Println("Successfully connected to MongoDB")
	database := client.Database("paymentku")
	return database, nil
}

func NewTransferCollection(db *mongo.Database) *TransferStore {
	transferInfoCollection := db.Collection("transfer_info")
	return &TransferStore{db: transferInfoCollection}
}

func NewTopUpCollection(c *mongo.Database) *TopUpStore {
	topupCollection := c.Collection("topup_info")
	return &TopUpStore{db: topupCollection}
}
