package main

import (
	"fmt"
	"log"
	"path/filepath"

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
	// start with /home/* + "../../.env" dir
	envFilePath := filepath.Join("/home/syafiq/Desktop/codingan/paymentkumicroservices/", ".env")
	fmt.Println(envFilePath)
	if err := godotenv.Load(envFilePath); err != nil {
		fmt.Println("Failed to load env file")
	}
	if err := HistoryServer(":8801"); err != nil {
		log.Fatal(err)
	}
}
