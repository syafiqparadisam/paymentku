package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
	"github.com/syafiqparadisam/paymentku/domain/transaction/apitransaction"
	"github.com/syafiqparadisam/paymentku/domain/transaction/mongotransaction"
	"github.com/syafiqparadisam/paymentku/domain/transaction/mysqltransaction"
	"github.com/syafiqparadisam/paymentku/domain/transaction/providertransaction"
)

func TransactionServer(port string) error {
	mysql, errSql := mysqltransaction.ConnectMySql()
	if errSql != nil {
		log.Fatal(errSql)
	}
	mongo, errMongo := mongotransaction.ConnectMongoDB()
	if errMongo != nil {
		log.Fatal(errMongo)
	}
	topUp := mongotransaction.NewTopUpCollection(mongo)
	transfer := mongotransaction.NewTransferCollection(mongo)

	service := providertransaction.NewProvider(mysql, topUp, transfer)
	server := apitransaction.NewServer(service, port)
	return server.Run()
}

func main() {
	currentDir, err := os.Getwd()
	if err != nil {
		log.Fatalf("Failed to get current working directory: %v", err)
	}
	
	// start with /home/* + "../../.env" dir
	envFilePath := filepath.Join(currentDir, "../../.env")
	if err := godotenv.Load(envFilePath); err != nil {
		fmt.Println("Failed to load env file")
	}
	if err := TransactionServer(":8802"); err != nil {
		log.Fatal(err)
	}
}
