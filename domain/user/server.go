package main

import (
	"fmt"
	"log"

	"github.com/joho/godotenv"
	"github.com/syafiqparadisam/paymentku/domain/user/apiuser"
	"github.com/syafiqparadisam/paymentku/domain/user/mongouser"
	"github.com/syafiqparadisam/paymentku/domain/user/mysqluser"
	"github.com/syafiqparadisam/paymentku/domain/user/provideruser"
)

func UserServer(port string) error {
	mysql, errConnMySQL := mysqluser.ConnectMySql()
	if errConnMySQL != nil {
		return errConnMySQL
	}
	mongo, errConnMongo := mongouser.ConnectMongoDB()
	if errConnMongo != nil {
		return errConnMongo
	}

	topup := mongouser.NewTopUpCollection(mongo)
	transfer := mongouser.NewTransferCollection(mongo)

	service := provideruser.NewService(mysql, topup, transfer)
	server := apiuser.NewServer(service, port)
	return server.Run()
}

func main() {
	if err := godotenv.Load(".env"); err != nil {
		fmt.Println("Failed to load env file")
	}
	if err := UserServer(":8803"); err != nil {
		log.Fatal(err)
	}
}
