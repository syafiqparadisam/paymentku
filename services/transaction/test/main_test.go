package transaction_test

import (
	"fmt"
	"log"
	"os"
	"testing"

	"github.com/joho/godotenv"
	"github.com/syafiqparadisam/paymentku/services/transaction/config"
	controllerhttp "github.com/syafiqparadisam/paymentku/services/transaction/controller/http"
	transaction_repo "github.com/syafiqparadisam/paymentku/services/transaction/repository/transaction"
	"github.com/syafiqparadisam/paymentku/services/transaction/test/seeder"
	"github.com/syafiqparadisam/paymentku/services/transaction/usecase"
)

type Seeder struct {
	TopUpSeeder    *seeder.TopUpSeeder
	UserSeeder     *seeder.UserSeeder
	TransferSeeder *seeder.TransferSeeder
	NotifSeeder    *seeder.NotifSeeder
}

type TransactionTestWeb struct {
	Test           *testing.T
	Seeder         *Seeder
	ControllerHTTP *controllerhttp.ControllerHTTP
}

func TestTransactionWeb(t *testing.T) {
	envFilePath := "../.env"
	if err := godotenv.Load(envFilePath); err != nil {
		fmt.Println("Failed to load env file")
	}
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASS")
	host := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")
	dbParam := os.Getenv("DB_PARAM")
	url := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?%s", user, pass, host, dbPort, dbName, dbParam)
	t.Log(url)
	mysql, errSql := config.NewMySqlStore(url)
	if errSql != nil {
		log.Fatal(errSql)
	}
	userSeeder := seeder.NewUserSeeder(mysql)
	tfSeeder := seeder.NewTransferSeeder(mysql)
	notifSeeder := seeder.NewNotifSeeder(mysql)
	topUpSeeder := seeder.NewTopUpSeeder(mysql)
	topUpRepo := transaction_repo.NewTopUpRepository(mysql)
	transferRepo := transaction_repo.NewTransferRepository(mysql)

	usecase := usecase.NewTransactionUsecase(transferRepo, topUpRepo)
	server := controllerhttp.NewControllerHTTP(usecase)

	pr := NewTransactionTestWeb(&Seeder{TopUpSeeder: topUpSeeder, UserSeeder: userSeeder, TransferSeeder: tfSeeder, NotifSeeder: notifSeeder}, t, server)
	pr.Start()
}

func NewTransactionTestWeb(seeder *Seeder, t *testing.T, controller *controllerhttp.ControllerHTTP) *TransactionTestWeb {
	return &TransactionTestWeb{
		Test:           t,
		Seeder:         seeder,
		ControllerHTTP: controller,
	}
}

func (tf *TransactionTestWeb) Start() {
	tf.Test.Run("TransactionTestWeb CreateTopUpTransaction", tf.CreateTopUpTransaction)
	tf.Test.Run("TransactionTestWeb CreateTopUpTransactionWith0Amount",tf.CreateTopUpTransactionWith0Amount)
	tf.Test.Run("TransactionTestWeb CreateTransferTransaction", tf.CreateTransferTransaction)
	tf.Test.Run("TransactionTestWeb CreateTransferTransactionWithLessBalance", tf.CreateTransferTransactionWithLessBalance)
	tf.Test.Run("TransactionTestWeb CreateTransferTransactionWithSelfAccountNumber", tf.CreateTransferTransactionWithSelfAccountNumber)
}
