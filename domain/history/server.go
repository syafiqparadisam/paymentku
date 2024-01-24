package main

import (
	"fmt"
	"log"

	"github.com/joho/godotenv"
	"github.com/syafiqparadisam/paymentku/domain/history/apihistory"
	"github.com/syafiqparadisam/paymentku/domain/history/mongohistory"
	"github.com/syafiqparadisam/paymentku/domain/history/mysqlhistory"
	"github.com/syafiqparadisam/paymentku/domain/history/providerhistory"
)

func HistoryServer(port string) error {
	mysql, errSql := mysqlhistory.ConnectMySql()
	if errSql != nil {
		log.Fatal(errSql)
	}
	mongo, errMongo := mongohistory.NewMongoDBStore()
	if errMongo != nil {
		log.Fatal(errMongo)
	}
	topUp := mongohistory.NewTopUpCollection(mongo)
	transfer := mongohistory.NewTransferCollection(mongo)

	service := providerhistory.NewProvider(mysql, topUp, transfer)
	server := apihistory.NewServer(service, port)
	return server.Run()
}
func main() {
	if err := godotenv.Load(".env"); err != nil {
		fmt.Println("Failed to load env file")
	}
	if err := HistoryServer(":8801"); err != nil {
		log.Fatal(err)
	}
}
