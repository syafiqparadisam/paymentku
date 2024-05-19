package transaction_repo

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/syafiqparadisam/paymentku/services/transaction/config"
	"github.com/syafiqparadisam/paymentku/services/transaction/domain"
	"github.com/syafiqparadisam/paymentku/services/transaction/errors"
)

type TransferRepository struct {
	mySqlDb *config.MySqlStore
}

func NewTransferRepository(mysql *config.MySqlStore) *TransferRepository {
	return &TransferRepository{mysql}
}

type TransferInterface interface {
	FindUsersById(tx *sql.Tx, ctx context.Context, id int) (*domain.UserInfo, error)
	DecreaseBalanceById(tx *sql.Tx, ctx context.Context, amount uint, userid int) error
	IncreaseBalanceByAccNumber(tx *sql.Tx, ctx context.Context, amount uint, accNum uint64) error
	FindUserByAccNum(tx *sql.Tx, ctx context.Context, accNum uint64) (*domain.UserInfo, error)
	InsertTransferHistory(tx *sql.Tx, ctx context.Context, domain *domain.HistoryTransfer) error
	StartTransaction(ctx context.Context) (*sql.Tx, error)
	InsertToNotification(tx *sql.Tx, ctx context.Context, domain *domain.Notification) error
}

func (s *TransferRepository) StartTransaction(ctx context.Context) (*sql.Tx, error) {
	return s.mySqlDb.Db.BeginTx(ctx, &sql.TxOptions{Isolation: sql.LevelReadCommitted})
}

func (s *TransferRepository) FindUsersById(tx *sql.Tx, ctx context.Context, userid int) (*domain.UserInfo, error) {
	rows, err := tx.QueryContext(ctx, "SELECT user, email, accountNumber, balance, name FROM users INNER JOIN profile ON users.profileId = profile.id WHERE users.id = ?", userid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	userInfo := &domain.UserInfo{}
	if rows.Next() {
		if err := rows.Scan(&userInfo.User, &userInfo.Email, &userInfo.AccountNumber, &userInfo.Balance, &userInfo.Name); err != nil {
			return nil, err
		}
		return userInfo, nil
	}

	return nil, sql.ErrNoRows
}

func (s *TransferRepository) DecreaseBalanceById(tx *sql.Tx, ctx context.Context, amount uint, id int) error {
	result, err := tx.ExecContext(ctx, "update users set balance = balance - ? where id = ?;", amount, id)
	if err != nil {
		return err
	}
	numAffected, err := result.RowsAffected()
	if (err != nil) || (numAffected == 0) {
		return errors.ErrAffectedRows
	}
	return nil
}

func (s *TransferRepository) IncreaseBalanceByAccNumber(tx *sql.Tx, ctx context.Context, amount uint, accNumber uint64) error {
	result, err := tx.ExecContext(ctx, "update users set balance = balance + ? where accountNumber = ?", amount, accNumber)

	if err != nil {
		return err
	}
	fmt.Println(err)
	rowsAffect, errAffected := result.RowsAffected()
	if (rowsAffect == 0) || (errAffected != nil) {
		return errors.ErrAffectedRows
	}
	return nil
}

func (s *TransferRepository) FindUserByAccNum(tx *sql.Tx, ctx context.Context, accNumber uint64) (*domain.UserInfo, error) {
	rows, err := tx.QueryContext(ctx, "SELECT users.id, user, email, accountNumber, balance, name FROM users INNER JOIN profile ON users.profileId = profile.id WHERE users.accountNumber = ?", accNumber)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	userInfo := &domain.UserInfo{}
	if rows.Next() {
		if err := rows.Scan(&userInfo.Id, &userInfo.User, &userInfo.Email, &userInfo.AccountNumber, &userInfo.Balance, &userInfo.Name); err != nil {
			return nil, err
		}
		return userInfo, nil
	}

	return nil, sql.ErrNoRows
}

func (s *TransferRepository) InsertTransferHistory(tx *sql.Tx, ctx context.Context, transfer *domain.HistoryTransfer) error {
	println(transfer.CreatedAt, transfer.UserId, transfer.Status)
	result, err := tx.ExecContext(ctx, "INSERT INTO history_transfer (sender, sender_name, receiver, receiver_name, status, notes, amount, created_at,previous_balance, balance, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", transfer.Sender, transfer.SenderName, transfer.Receiver, transfer.ReceiverName, transfer.Status, transfer.Notes, transfer.Amount, transfer.CreatedAt, transfer.PreviousBalance,transfer.Balance, transfer.UserId)
	if err != nil {
		return err
	}
	rowsAffect, errAffected := result.RowsAffected()
	if (rowsAffect == 0) || (errAffected != nil) {
		return errors.ErrAffectedRows
	}
	return nil
}

func (s *TransferRepository) InsertToNotification(tx *sql.Tx, ctx context.Context, domain *domain.Notification) error {
	result, err := tx.ExecContext(ctx, "INSERT INTO notification (icon, title, description, type, userId, created_at) VALUES (?, ?, ?, ?, ?, ?);", domain.Icon, domain.Title, domain.Description, domain.Type, domain.UserId, domain.CreatedAt)
	if err != nil {
		return err
	}

	affRows, _ := result.RowsAffected()
	if affRows == 0 {
		return errors.ErrAffectedRows
	}
	return nil
}
