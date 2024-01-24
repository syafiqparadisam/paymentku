package providertransaction

import (
	"fmt"
	"time"

	"github.com/syafiqparadisam/paymentku/domain/transaction/dtotransaction"
	"github.com/syafiqparadisam/paymentku/domain/transaction/mongotransaction"
	"github.com/syafiqparadisam/paymentku/domain/transaction/mysqltransaction"
	"github.com/syafiqparadisam/paymentku/shared"
)

type Provider struct {
	Sql      mysqltransaction.MySqlRepository
	TopUp    mongotransaction.TopUpRepository
	Transfer mongotransaction.TransferRepository
}

type ProviderMethod interface {
	FindAccount(dto *dtotransaction.FindUserRequest) shared.APIResponse
	NewHistoryTopUp(dto *dtotransaction.TopUpRequest, decode *shared.UserJwtDecode) shared.APIResponse
	NewHistoryTransfer(dto *dtotransaction.TransferRequest, decode *shared.UserJwtDecode) shared.APIResponse
}

func NewProvider(mysqlrepo mysqltransaction.MySqlRepository, topUpRepo mongotransaction.TopUpRepository, transferRepo mongotransaction.TransferRepository) *Provider {
	return &Provider{Sql: mysqlrepo, TopUp: topUpRepo, Transfer: transferRepo}
}

func NewCreatedAt() string {
	now := time.Now()

	// Mendapatkan lokasi (GMT+07:00)
	lokasi := time.FixedZone("GMT+7", 7*60*60)

	// Menyesuaikan waktu dengan lokasi yang diinginkan
	now = now.In(lokasi)

	// Memformat waktu sesuai dengan kebutuhan
	formatWaktu := "2006-01-02 15:04 MST-07:00"
	waktuFormatted := now.Format(formatWaktu)

	// Menampilkan waktu yang diformat
	fmt.Println(waktuFormatted)
	return waktuFormatted
}
