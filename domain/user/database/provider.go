package database

import (
	"context"
	"database/sql"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
)

type MySQlStore struct {
	db *sql.DB
}

type MongoDBStore struct {
	db *mongo.Database
}

func NewMySQLStore() (*MySQlStore, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	db, err := sql.Open("mysql", "urlmysql")
	if err != nil {
		return nil, err
	}

	if errPingDB := db.PingContext(ctx); errPingDB != nil {
		return nil, errPingDB
	}

	println("connected to mysql")

	return &MySQlStore{
		db: db,
	}, nil
}

func NewMongoDBStore() (*MongoDBStore, error) {
	return nil, err
}
