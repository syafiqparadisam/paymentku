package db

import (
	"context"
	"database/sql"
	"fmt"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoTopUpStore struct {
	db *mongo.Collection
}

type MongoTransferStore struct {
	db *mongo.Collection
}

type MySqlStore struct {
	db *sql.DB
}


type MergedHistory struct {
	TopUpHistory TopUpHistory
	TransferHistory []TransferHistory
}

func ConnectMySql() (*MySqlStore, error) {
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASS")
	port := os.Getenv("DB_PORT")
	dbname := os.Getenv("DB_DBNAME")
	info := fmt.Sprintln(fmt.Sprintf("%s:%s@tcp(localhost:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", user, pass, port, dbname))
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(localhost:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", user, pass, port, dbname))
	if err != nil {
		return nil, err
	}
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*4)
	defer cancel()
	errPingDb := db.PingContext(ctx)
	if errPingDb != nil {
		return nil, errPingDb
	}
	fmt.Println(info)
	fmt.Println("connected to mysql on port ", port)
	return &MySqlStore{db: db}, nil
}

func NewMongoDBStore() (*mongo.Database, error) {
	pass := os.Getenv("PASS_MONG")
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

func NewTransferCollection(db *mongo.Database) *MongoTransferStore {
	transferInfoCollection := db.Collection("transfer_info")
	return &MongoTransferStore{db: transferInfoCollection}
}

func NewTopUpCollection(c *mongo.Database) *MongoTopUpStore {
	topupCollection := c.Collection("topup_info")
	return &MongoTopUpStore{db: topupCollection}
}


func NewAllHistory(db *mongo.Database, topUpCollection *MongoTopUpStore) {

	ctx,cancel := context.WithTimeout(context.Background(), time.Second *4)
	defer cancel()
	pipeline := bson.A{
		bson.M{
			"$lookup": bson.M{
				"$from": "transfer_info",
				"let": bson.M{"user_id": "$user_id"},
				"pipeline": bson.A{
					bson.M{
						"$match": bson.M{
							"$expr": bson.M{"$eq": []interface{}{"$user_id", "$$user_id"}},
						},
					},
				},
				"as": "transfer_info",
			},
		},
		bson.M{
			"$unwind": "$topup_info",
		},
		bson.M{
			"$sort": bson.M{"topup_info.created_at": 1},
		},
	}

	cursor,err := topUpCollection.db.Aggregate(context.TODO(), mongo.Pipeline{pipeline})
	if err != nil {
		fmt.Println(err)
	}
	var result []MergedHistory

	if err := cursor.All(ctx, &result); err != nil {
		fmt.Println(err)
	}
	for _, v := range result {
		fmt.Println(v)
	}
}