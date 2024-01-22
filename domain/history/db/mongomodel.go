package db

type TopupInfo struct {
	UserId          int    `bson:"userid"`
	CreatedAt       string `bson:"created_at"`
	Uang_sebelumnya uint64 `bson:"uang_sebelumnya"`
	Uang_setelahnya uint64 `bson:"uang_setelahnya"`
	Amount          uint32 `bson:"amount"`
	IsRead          bool   `bson:"isRead"`
}

type TransferInfo struct {
	UserId         int    `bson:"userid"`
	To             string `bson:"to"`
	ToAccount      int64  `bson:"to_account"`
	Notes          string `bson:"notes"`
	CreatedAt      string `bson:"created_at"`
	RemainingMoney uint64 `bson:"remaining_money"`
	Amount         uint32 `bson:"amount"`
	IsRead         bool   `bson:"isRead"`
}
