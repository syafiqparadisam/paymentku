package seeder

import (
	"database/sql"
	"fmt"
	"log"

	history_config "github.com/syafiqparadisam/paymentku/services/history/config"
	"github.com/syafiqparadisam/paymentku/services/history/domain"
	"github.com/syafiqparadisam/paymentku/services/history/test/mock"
)

type TopUpSeeder struct {
	MySql *history_config.MySqlStore
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

func NewTopUpSeeder(mysql *history_config.MySqlStore) *TopUpSeeder {
	return &TopUpSeeder{MySql: mysql}
}

func (topUpSeeder *TopUpSeeder) FindAll(userid int) (*[]domain.HistoryTopUpForGetAll, error) {
	rowsHistory, err := topUpSeeder.MySql.Db.Query("SELECT history_topup.id, amount, isRead, status, history_topup.created_at FROM history_topup INNER JOIN users ON history_topup.userId = users.id WHERE history_topup.userId = ?", userid)

	if err != nil {
		return nil, err
	}
	defer rowsHistory.Close()

	arrOfHistoryTopUp := []domain.HistoryTopUpForGetAll{}
	for rowsHistory.Next() {
		history := &domain.HistoryTopUpForGetAll{}
		if err := rowsHistory.Scan(&history.Id, &history.Amount, &history.IsRead, &history.Status, &history.CreatedAt); err != nil {
			return nil, err
		}
		arrOfHistoryTopUp = append(arrOfHistoryTopUp, *history)
	}
	return &arrOfHistoryTopUp, nil
}

func (topUpSeeder *TopUpSeeder) FindById(id int, userid int) (*domain.HistoryTopUp, error) {
	rowsHistory, err := topUpSeeder.MySql.Db.Query("SELECT id, amount, balance, previous_balance, isRead, status, created_at FROM history_topup WHERE id = ? AND userId = ? FOR UPDATE", id, userid)

	if err != nil {
		return nil, err
	}
	defer rowsHistory.Close()
	history := &domain.HistoryTopUp{}
	if rowsHistory.Next() {
		if err := rowsHistory.Scan(&history.Id, &history.Amount, &history.Balance, &history.PreviousBalance, &history.IsRead, &history.Status, &history.CreatedAt); err != nil {
			return nil, err
		}
		return history, nil
	}
	return nil, sql.ErrNoRows
}

func (topUpSeeder *TopUpSeeder) Up(payload *mock.HistoryTopUp) int64 {
	result, err := topUpSeeder.MySql.Db.Exec("INSERT INTO history_topup (userId, amount,balance,status,previous_balance,created_at) VALUES (?,?,?,?,?,?)", payload.UserId, payload.Amount, payload.Balance, payload.Status, payload.PreviousBalance, payload.CreatedAt)
	if err != nil {
		panic(err)
	}
	idTopUp, _ := result.LastInsertId()
	fmt.Println("Topup seeder has been up")
	return idTopUp
}

func (topupSeeder *TopUpSeeder) Down(id int64) {
	result, err := topupSeeder.MySql.Db.Exec("DELETE FROM history_topup WHERE id = ?", id)
	if err != nil {
		log.Fatal(err.Error())
	}
	affRows, _ := result.RowsAffected()
	if affRows == 0 {
		panic("Nothing to update")
	}
	fmt.Println("Topup seeder has been down")
}
