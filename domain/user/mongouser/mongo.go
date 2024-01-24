package mongouser

import "go.mongodb.org/mongo-driver/mongo"

type TopUpRepository interface {
}

type TransferRepository interface {
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
