package main

import (
	"historyservice/db"
	"historyservice/handlers"
	"log"

	"github.com/joho/godotenv"
)

func initialization() {
	if err := godotenv.Load("./shared/.env"); err != nil {
		log.Fatal("failed to load env file ", err)
	}
}

func main() {
	initialization()
	mysql, err := db.ConnectMySql()
	if err != nil {
		log.Fatal("failed to connect to mysql", err.Error())
	}
	mongo, errConnectMongoDB := db.NewMongoDBStore()
	if errConnectMongoDB != nil {
		log.Fatal("failed to connect to mongodb", errConnectMongoDB.Error())
	}
	topup := db.NewTopUpCollection(mongo)
	db.NewAllHistory(mongo, topup)
	transfer := db.NewTransferCollection(mongo)

	server := handlers.NewApiServer(topup, transfer, mysql, ":8804")
	server.Run()
}
