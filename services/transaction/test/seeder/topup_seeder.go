package seeder

import (
	"fmt"
	"log"

	transaction_config "github.com/syafiqparadisam/paymentku/services/transaction/config"
)

type TopUpSeeder struct {
	MySql *transaction_config.MySqlStore
}

type TopUp struct {
	Id              int64
	Amount          uint
	Balance         int64
	PreviousBalance int64
	IsRead          int8
	UserId          int64
	Status          string
	CreatedAt       string
}

func NewTopUpSeeder(mysql *transaction_config.MySqlStore) *TopUpSeeder {
	return &TopUpSeeder{MySql: mysql}
}

func (topupSeeder *TopUpSeeder) Find(idUser int64) *[]TopUp {
	rows, err := topupSeeder.MySql.Db.Query("SELECT id,amount,balance,previous_balance,isRead,userId,status,created_at FROM history_topup WHERE userId = ?", idUser)
	if err != nil {
		panic(err)
	}
	arrTopUp := []TopUp{}
	for rows.Next() {
		topup := &TopUp{}
		if err := rows.Scan(&topup.Id, &topup.Amount, &topup.Balance, &topup.PreviousBalance, &topup.IsRead, &topup.UserId, &topup.Status, &topup.CreatedAt); err != nil {
			fmt.Println("SCANNING ERROR")
			panic(err)
		}
		arrTopUp = append(arrTopUp, *topup)
	}
	return &arrTopUp
}

func (topupSeeder *TopUpSeeder) Down(idUser int64) {
	result, err := topupSeeder.MySql.Db.Exec("DELETE FROM history_topup WHERE userId = ?", idUser)
	if err != nil {
		log.Fatal(err.Error())
	}
	affRows, _ := result.RowsAffected()
	if affRows == 0 {
		panic("Nothing to update")
	}
	fmt.Println("Topup seeder has been down")
}
