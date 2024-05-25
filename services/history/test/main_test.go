package test

import (
	"fmt"
	"log"
	"os"
	"testing"

	"github.com/joho/godotenv"
	"github.com/syafiqparadisam/paymentku/services/history/config"
	controller_http "github.com/syafiqparadisam/paymentku/services/history/controller/http"
	history_repo "github.com/syafiqparadisam/paymentku/services/history/repository/history"
	"github.com/syafiqparadisam/paymentku/services/history/test/seeder"
	"github.com/syafiqparadisam/paymentku/services/history/usecase"
)

type HistoryTest struct {
	*Seeder
	Test       *testing.T
	Controller *controller_http.ControllerHTTP
}

type Seeder struct {
	TopUpSeeder    *seeder.TopUpSeeder
	UserSeeder     *seeder.UserSeeder
	TransferSeeder *seeder.TransferSeeder
}

func TestHistory(t *testing.T) {
	envFilePath := "../.env"
	if err := godotenv.Load(envFilePath); err != nil {
		log.Fatal("Failed to load env file")
	}
	appPort := os.Getenv("APP_PORT")
	t.Log(appPort)
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASS")
	host := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")
	dbParam := os.Getenv("DB_PARAM")
	url := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?%s", user, pass, host, dbPort, dbName, dbParam)
	mysql, errSql := config.NewMySqlStore(url)
	if errSql != nil {
		log.Fatal(errSql)
	}
	t.Log(url)
	userSeeder := seeder.NewUserSeeder(mysql)
	topupSeeder := seeder.NewTopUpSeeder(mysql)
	tfSeeder := seeder.NewTransferSeeder(mysql)
	seeder := &Seeder{
		UserSeeder:     userSeeder,
		TopUpSeeder:    topupSeeder,
		TransferSeeder: tfSeeder,
	}

	tfRepo := history_repo.NewTransferRepository(mysql)
	topUpRepo := history_repo.NewTopUpRepository(mysql)
	usecase := usecase.NewHistoryUsecase(tfRepo, topUpRepo)
	cfg := config.NewHTTPConfig().WithPort(appPort)
	server := controller_http.NewControllerHTTP(usecase, cfg)
	history := NewHistoryTest(t, server, seeder)
	history.Start()
}

func NewHistoryTest(t *testing.T, controller *controller_http.ControllerHTTP, seeder *Seeder) *HistoryTest {
	return &HistoryTest{Test: t, Controller: controller, Seeder: seeder}
}

func (h *HistoryTest) Start() {
	h.Test.Run("GetAllHistoryTopUp", h.GetAllHistoryTopUp)
	h.Test.Run("GetHistoryTopUpById", h.GetHistoryTopUpById)
	h.Test.Run("GetHistoryTopUpByWrongId", h.GetHistoryTopUpByWrongId)
	// h.Test.Run("DeleteHistoryTopUpById", h.DeleteHistoryTopUpById)
	// h.Test.Run("DeleteHistoryTopUpByWrongId", h.DeleteHistoryTopUpByWrongId)
	// h.Test.Run("DeleteAllHistoryTopUp", h.DeleteAllHistoryTopUp)
	// h.Test.Run("DeleteHistoryTopUpWithEmptyData", h.DeleteAllHistoryTopUpWithEmptyData)
	// h.Test.Run("GetAllHistoryTransfer", h.GetAllHistoryTransfer)
	// h.Test.Run("GetHistoryTransferById", h.GetHistoryTransferById)
	// h.Test.Run("GetHistoryTransferByWrongId", h.GetHistoryTransferByWrongId)
	// h.Test.Run("DeleteHistoryTransferById", h.DeleteHistoryTransferById)
	// h.Test.Run("DeleteHistoryTransferByWrongId", h.DeleteHistoryTransferByWrongId)
	// h.Test.Run("DeleteAllHistoryTransfer", h.DeleteAllHistoryTransfer)
}
