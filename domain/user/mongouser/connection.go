package mongouser

import (
	"context"
	"fmt"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func ConnectMongoDB() (*mongo.Database, error) {
	mongoUrl := os.Getenv("MONGO_URL")
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	clientOptions := options.Client().ApplyURI(mongoUrl)
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
	return &TransferStore{coll: transferInfoCollection}
}

func NewTopUpCollection(c *mongo.Database) *TopUpStore {
	topupCollection := c.Collection("topup_info")
	return &TopUpStore{coll: topupCollection}
}
