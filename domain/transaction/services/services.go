package services

import (
	"fmt"
	"time"

	"github.com/syafiqparadisam/paymentku/domain/transaction/dto"
	mongodbrepo "github.com/syafiqparadisam/paymentku/domain/transaction/mongodbrepo"
	"github.com/syafiqparadisam/paymentku/domain/transaction/mysqlrepo"
	"github.com/syafiqparadisam/paymentku/shared"
)

type Service struct {
	Sql      mysqlrepo.MySqlProvider
	TopUp    mongodbrepo.TopUpRepository
	Transfer mongodbrepo.TransferRepository
}

type Provider interface {
	FindAccount(dto *dto.FindUserRequest) shared.APIResponse
	NewHistoryTopUp(dto *dto.TopUpRequest, decode *shared.UserJwtDecode) shared.APIResponse
	NewHistoryTransfer(dto *dto.TransferRequest, decode *shared.UserJwtDecode) shared.APIResponse
}

func NewService(mysqlrepo mysqlrepo.MySqlProvider, topUpRepo mongodbrepo.TopUpRepository, transferRepo mongodbrepo.TransferRepository) *Service {
	return &Service{Sql: mysqlrepo, TopUp: topUpRepo, Transfer: transferRepo}
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
