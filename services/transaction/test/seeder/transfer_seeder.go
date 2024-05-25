package seeder

import (
	"fmt"
	"log"

	transaction_config "github.com/syafiqparadisam/paymentku/services/transaction/config"
)

type TransferSeeder struct {
	MySql *transaction_config.MySqlStore
}

func NewTransferSeeder(mysql *transaction_config.MySqlStore) *TransferSeeder {
	return &TransferSeeder{
		MySql: mysql,
	}
}

type HistoryTransfer struct {
	Id           int64
	Sender       string
	Receiver     string
	Notes        string
	Amount       uint
	IsRead       int8
	Status       string
	SenderName   string
	ReceiverName string
	CreatedAt    string
	PreviousBalance int64
	Balance int64
	UserId       int64
}

func (transferSeeder *TransferSeeder) Find(idUser int64) *[]HistoryTransfer {
	rows, err := transferSeeder.MySql.Db.Query("SELECT * FROM history_transfer WHERE userId = ?", idUser)
	if err != nil {
		panic(err)
	}

	arrOfHistory := []HistoryTransfer{}
	for rows.Next() {
		history := &HistoryTransfer{}
		if err := rows.Scan(
			&history.Id,
			&history.Sender,
			&history.SenderName,
			&history.Receiver,
			&history.ReceiverName,
			&history.PreviousBalance,
			&history.Balance,
			&history.Status,
			&history.Notes,
			&history.Amount,
			&history.IsRead,
			&history.CreatedAt,
			&history.UserId,
		); err != nil {
			panic(err)
		}
	}
	return &arrOfHistory
}

func (transferSeeder *TransferSeeder) Down(idUser int64) {
	result, err := transferSeeder.MySql.Db.Exec("DELETE FROM history_transfer WHERE userId = ?", idUser)
	if err != nil {
		log.Fatal(err.Error())
	}
	affRows, _ := result.RowsAffected()
	if affRows == 0 {
		panic("Nothing to update")
	}
	fmt.Println("Transfer Seeder has been down")
}
