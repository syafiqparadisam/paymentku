package seeder

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/syafiqparadisam/paymentku/services/transactional/config"
	"github.com/syafiqparadisam/paymentku/services/transactional/domain"
	"github.com/syafiqparadisam/paymentku/services/transactional/test/mock"
)

type TransferSeeder struct {
	MySql *config.MySqlStore
}

func NewTransferSeeder(mysql *config.MySqlStore) *TransferSeeder {
	return &TransferSeeder{
		MySql: mysql,
	}
}


type HistoryTransferFull struct {
	Id              int64
	Sender          string
	Receiver        string
	Notes           string
	Amount          uint
	IsRead          int8
	Status          string
	SenderName      string
	ReceiverName    string
	CreatedAt       string
	PreviousBalance int64
	Balance         int64
	UserId          int64
}

type HistoryTransfer struct {
	Id           int
	Sender       string
	Receiver     string
	Notes        string
	Amount       int
	IsRead       int8
	Status       string
	SenderName   string
	ReceiverName string
	CreatedAt    string
	UserId       int64
}

func (transferSeeder *TransferSeeder) Find(idUser int64) *[]HistoryTransferFull {
	rows, err := transferSeeder.MySql.Db.Query("SELECT * FROM history_transfer WHERE userId = ?", idUser)
	if err != nil {
		panic(err)
	}

	arrOfHistory := []HistoryTransferFull{}
	for rows.Next() {
		history := &HistoryTransferFull{}
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
		arrOfHistory = append(arrOfHistory, *history)
	}
	fmt.Println("Transfer Seeder has been up")
	return &arrOfHistory
}

func (transferSeeder *TransferSeeder) Up(payload *mock.HistoryTransfer) int64 {

	result, err := transferSeeder.MySql.Db.Exec("INSERT INTO history_transfer (userId, sender, sender_name,receiver, receiver_name,status,notes,amount,created_at,previous_balance,balance) VALUES (?,?,?,?,?,?,?,?,?,?,?)", payload.UserId, payload.Sender, payload.SenderName, payload.Receiver, payload.ReceiverName, payload.Status, payload.Notes, payload.Amount, payload.CreatedAt, payload.PreviousBalance, payload.PreviousBalance-int64(payload.Amount))
	if err != nil {
		panic(err)
	}

	idTransfer, _ := result.LastInsertId()
	return idTransfer
}

func (transferSeeder *TransferSeeder) FindAll(userid int) (*[]domain.GetHistoryTransfers, error) {
	rowsHistory, err := transferSeeder.MySql.Db.Query("SELECT id, sender, receiver, amount, isRead, status, created_at FROM history_transfer WHERE userId = ? ORDER BY created_at DESC;", userid)
	if err != nil {
		return nil, err
	}
	defer rowsHistory.Close()
	arrOfHistoryTf := []domain.GetHistoryTransfers{}
	for rowsHistory.Next() {
		historyTf := &domain.GetHistoryTransfers{}
		if err := rowsHistory.Scan(
			&historyTf.Id,
			&historyTf.Sender,
			&historyTf.Receiver,
			&historyTf.Amount,
			&historyTf.IsRead,
			&historyTf.Status,
			&historyTf.CreatedAt,
		); err != nil {
			return nil, err
		}
		arrOfHistoryTf = append(arrOfHistoryTf, *historyTf)
	}
	return &arrOfHistoryTf, nil
}

func (transferSeeder *TransferSeeder) FindById(id int, userid int) (*domain.GetHistoryTransferById, error) {
	rowsHistory, err := transferSeeder.MySql.Db.Query("SELECT id, sender, receiver, notes, amount, isRead, status, sender_name, receiver_name, previous_balance,balance, created_at FROM history_transfer WHERE id = ? AND userId = ?", id, userid)
	if err != nil {
		return nil, err
	}
	defer rowsHistory.Close()
	history := &domain.GetHistoryTransferById{}
	if rowsHistory.Next() {
		if err := rowsHistory.Scan(
			&history.Id,
			&history.Sender,
			&history.Receiver,
			&history.Notes,
			&history.Amount,
			&history.IsRead,
			&history.Status,
			&history.SenderName,
			&history.ReceiverName,
			&history.PreviousBalance,
			&history.Balance,
			&history.CreatedAt,
		); err != nil {
			return nil, err
		}
		return history, nil
	}
	return nil, sql.ErrNoRows
}


func (transferSeeder *TransferSeeder) DownFromUserid(idUser int64) {
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


func (transferSeeder *TransferSeeder) Down(idTransfer int64) {
	result, err := transferSeeder.MySql.Db.Exec("DELETE FROM history_transfer WHERE id = ?", idTransfer)
	if err != nil {
		log.Fatal(err.Error())
	}
	affRows, _ := result.RowsAffected()
	if affRows == 0 {
		panic("Nothing to update")
	}
	fmt.Println("Transfer Seeder has been down")
}
