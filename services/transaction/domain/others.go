package domain

type Balance struct {
	Balance int64
}

type UserInfo struct {
	Id            int
	User          string
	Email         string
	AccountNumber uint64
	Balance       int64
	Name          string
}
