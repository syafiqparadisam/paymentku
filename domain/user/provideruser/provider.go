package provideruser

import (
	"github.com/syafiqparadisam/paymentku/domain/user/mongouser"
	"github.com/syafiqparadisam/paymentku/domain/user/mysqluser"
)

type Provider struct {
	Sql      mysqluser.MySqlRepository
	TopUp    mongouser.TopUpRepository
	Transfer mongouser.TransferRepository
}

func NewService(mysql mysqluser.MySqlRepository, topup mongouser.TopUpRepository, transfer mongouser.TransferRepository) *Provider {
	return &Provider{
		Sql: mysql,
		TopUp: topup,
		Transfer: transfer,
	}
}

type ProviderMethod interface {

}

// func (s *Provider) GetUserProfile() shared.APIResponse {
// 	return shared.APIResponse{}
// }
