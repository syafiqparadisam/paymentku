package test

import (
	"fmt"
	"log"
	"os"
	"testing"

	"github.com/joho/godotenv"
	"github.com/syafiqparadisam/paymentku/services/transactional/config"
	controller_http "github.com/syafiqparadisam/paymentku/services/transactional/controller/http"
	topup_repo "github.com/syafiqparadisam/paymentku/services/transactional/repository/topup"
	transfer_repo "github.com/syafiqparadisam/paymentku/services/transactional/repository/transfer"
	"github.com/syafiqparadisam/paymentku/services/transactional/test/seeder"
	"github.com/syafiqparadisam/paymentku/services/transactional/usecase"
)

type HistoryTest struct {
	*Seeder
	Test           *testing.T
	Controller     *controller_http.ControllerHTTP
	InternalSecret string
}

type Seeder struct {
	TopUpSeeder    *seeder.TopUpSeeder
	UserSeeder     *seeder.UserSeeder
	TransferSeeder *seeder.TransferSeeder
	NotifSeeder    *seeder.NotifSeeder
}

func TestHistory(t *testing.T) {
	envFilePath := "../.env"
	godotenv.Load(envFilePath)

	appPort := os.Getenv("APP_PORT")
	t.Log(appPort)

	internalSecret := os.Getenv("INTERNAL_SECRET")
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASSWD")
	host := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")
	url := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", user, pass, host, dbPort, dbName)
	mysql, errSql := config.NewMySqlStore(url)
	if errSql != nil {
		log.Fatal(errSql)
	}
	t.Log(url)
	userSeeder := seeder.NewUserSeeder(mysql)
	topupSeeder := seeder.NewTopUpSeeder(mysql)
	tfSeeder := seeder.NewTransferSeeder(mysql)
	notifSeeder := seeder.NewNotifSeeder(mysql)
	seeder := &Seeder{
		UserSeeder:     userSeeder,
		TopUpSeeder:    topupSeeder,
		TransferSeeder: tfSeeder,
		NotifSeeder: notifSeeder,
	}

	tfRepo := transfer_repo.NewTransferRepository(mysql)
	topUpRepo := topup_repo.NewTopUpRepository(mysql)
	usecase := usecase.NewTransactionalUsecase(tfRepo, topUpRepo)
	cfg := config.NewHTTPConfig().WithPort(appPort)
	server := controller_http.NewControllerHTTP(usecase, cfg)
	history := NewHistoryTest(t, server, seeder, internalSecret)
	history.Start()
}

func NewHistoryTest(t *testing.T, controller *controller_http.ControllerHTTP, seeder *Seeder, internalSecret string) *HistoryTest {
	return &HistoryTest{Test: t, Controller: controller, Seeder: seeder, InternalSecret: internalSecret}
}

func (h *HistoryTest) Start() {
	h.Test.Run("GetAllHistoryTopUp", h.GetAllHistoryTopUp)
	h.Test.Run("GetHistoryTopUpById", h.GetHistoryTopUpById)
	h.Test.Run("GetHistoryTopUpByWrongId", h.GetHistoryTopUpByWrongId)
	h.Test.Run("DeleteHistoryTopUpById", h.DeleteHistoryTopUpById)
	h.Test.Run("DeleteHistoryTopUpByWrongId", h.DeleteHistoryTopUpByWrongId)
	h.Test.Run("DeleteAllHistoryTopUp", h.DeleteAllHistoryTopUp)
	h.Test.Run("DeleteHistoryTopUpWithEmptyData", h.DeleteAllHistoryTopUpWithEmptyData)
	h.Test.Run("GetAllHistoryTransfer", h.GetAllHistoryTransfer)
	h.Test.Run("GetHistoryTransferById", h.GetHistoryTransferById)
	h.Test.Run("GetHistoryTransferByWrongId", h.GetHistoryTransferByWrongId)
	h.Test.Run("DeleteHistoryTransferById", h.DeleteHistoryTransferById)
	h.Test.Run("DeleteHistoryTransferByWrongId", h.DeleteHistoryTransferByWrongId)
	h.Test.Run("DeleteAllHistoryTransfer", h.DeleteAllHistoryTransfer)

	h.Test.Run("Do topup", h.CreateTopUpTransaction)
	h.Test.Run("Do topup with 0 amount", h.CreateTopUpTransactionWith0Amount)
	h.Test.Run("Do transfer", h.CreateTransferTransaction)
	h.Test.Run("Do transfer with less balance", h.CreateTransferTransactionWithLessBalance)
	h.Test.Run("Do transfer with self account number", h.CreateTransferTransactionWithSelfAccountNumber)

}
