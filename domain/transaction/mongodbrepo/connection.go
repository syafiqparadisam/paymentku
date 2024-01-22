package mongodbrepo

import (
	"context"
	"fmt"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func ConnectMongoDB() (*mongo.Database, error) {
	pass := os.Getenv("PASS_MONGO")
	fmt.Println(pass)
	uri := "mongodb+srv://mongotutorial:return500@cluster0.u6antwt.mongodb.net/?retryWrites=true&w=majority"
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
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

func NewTransferCollection(db *mongo.Database) *MongoTransferStore {
	transferInfoCollection := db.Collection("transfer_info")
	return &MongoTransferStore{coll: transferInfoCollection}
}

func NewTopUpCollection(c *mongo.Database) *MongoTopUpStore {
	topupCollection := c.Collection("topup_info")
	return &MongoTopUpStore{coll: topupCollection}
}
