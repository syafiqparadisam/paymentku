package domain

type AccountNumber struct {
	AccountNumber uint64
}

type IsRead struct {
	IsRead int8
}

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


// type WhoIsUser struct {
// senderAccount   uint64
// receiverAccount uint64
//
