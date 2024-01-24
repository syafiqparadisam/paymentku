package providerhistory

import (
	"time"

	"github.com/syafiqparadisam/paymentku/domain/history/mongohistory"
	"github.com/syafiqparadisam/paymentku/domain/history/mysqlhistory"
	"github.com/syafiqparadisam/paymentku/shared"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Provider struct {
	Sql      mysqlhistory.MySqlRepository
	TopUp    mongohistory.TopUpRepository
	Transfer mongohistory.TransferRepository
}

type ProviderMethod interface {
	GetAllTopUpHistory(decode *shared.UserJwtDecode) shared.APIResponse
	GetAllTopUpHistoryByIdHistory(idHistory *primitive.ObjectID, decode *shared.UserJwtDecode) shared.APIResponse
	GetAllTransferHistory(decode *shared.UserJwtDecode) shared.APIResponse
	GetAllTransferHistoryByIdHistory(idHistory *primitive.ObjectID, decode *shared.UserJwtDecode) shared.APIResponse
	GetAllHistory(decode *shared.UserJwtDecode) shared.APIResponse
}

func NewProvider(mysqlrepo mysqlhistory.MySqlRepository, topUpRepo mongohistory.TopUpRepository, transferRepo mongohistory.TransferRepository) *Provider {
	return &Provider{Sql: mysqlrepo, TopUp: topUpRepo, Transfer: transferRepo}
}

func customTimeParse(timeStr string) (time.Time, error) {
	return time.Parse("2006-01-02 15:04", timeStr)
}
