package transaction

import (
	"log"

	"github.com/syafiqparadisam/paymentku/domain/transaction/api"
	"github.com/syafiqparadisam/paymentku/domain/transaction/mongodbrepo"
	"github.com/syafiqparadisam/paymentku/domain/transaction/mysqlrepo"
	"github.com/syafiqparadisam/paymentku/domain/transaction/services"
)

func TransactionServer(port string) error {
	mysql, errSql := mysqlrepo.ConnectMySql()
	if errSql != nil {
		log.Fatal(errSql)
	}
	mongo, errMongo := mongodbrepo.ConnectMongoDB()
	if errMongo != nil {
		log.Fatal(errMongo)
	}
	topUp := mongodbrepo.NewTopUpCollection(mongo)
	transfer := mongodbrepo.NewTransferCollection(mongo)

	service := services.NewService(mysql, topUp, transfer)
	server := api.NewServer(service, port)
	return server.Run()
}
