package transfer_repo

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/syafiqparadisam/paymentku/services/transactional/config"
	"github.com/syafiqparadisam/paymentku/services/transactional/domain"
	"github.com/syafiqparadisam/paymentku/services/transactional/errors"
)

type TransferRepository struct {
	mysql *config.MySqlStore
}

func NewTransferRepository(mysql *config.MySqlStore) *TransferRepository {
	return &TransferRepository{mysql: mysql}
}

type TransferInterface interface {
	StartACID(context.Context) (*sql.Tx, error)
	GetHistoryTransferById(ctx context.Context, id int, userid int) (*domain.HistoryTransfer, error)
	GetAllHistoryTransfer(ctx context.Context, userid int) (*[]domain.HistoryTransferForGetAll, error)
	DeleteAllHistoryTransfer(tx *sql.Tx, ctx context.Context, userid int) error
	UpdateIsRead(ctx context.Context, id int) error
	FindIsRead(ctx context.Context, id int) (*domain.IsRead, error)
	DeleteHistoryTransferById(tx *sql.Tx, ctx context.Context, id int, userid int) error
}

func (t *TransferRepository) StartACID(ctx context.Context) (*sql.Tx, error) {
	return t.mysql.Db.BeginTx(ctx, &sql.TxOptions{Isolation: sql.LevelReadCommitted})
}

func (tp *TransferRepository) UpdateIsRead(ctx context.Context, id int) error {
	result, err := tp.mysql.Db.ExecContext(ctx, "UPDATE history_transfer SET isRead = 1 WHERE id = ?", id)
	if err != nil {
		panic(err)
	}
	affRows, _ := result.RowsAffected()
	if affRows == 0 {
		return errors.ErrAffectedRows
	}
	return nil
}

func (tp *TransferRepository) FindIsRead(ctx context.Context, id int) (*domain.IsRead, error) {
	rows, err := tp.mysql.Db.QueryContext(ctx, "SELECT isRead FROM history_transfer WHERE id = ?", id)
	if err != nil {
		panic(err)
	}
	defer rows.Close()

	isRead := &domain.IsRead{}
	if rows.Next() {
		if err := rows.Scan(&isRead.IsRead); err != nil {
			panic(err)
		}
		return isRead, nil
	}
	return nil, sql.ErrNoRows
}

func (tf *TransferRepository) GetAllHistoryTransfer(ctx context.Context, userid int) (*[]domain.HistoryTransferForGetAll, error) {
	rowsHistory, err := tf.mysql.Db.QueryContext(ctx, "SELECT id, sender, receiver, amount, isRead, status, created_at FROM history_transfer WHERE userId = ? ORDER BY created_at DESC", userid)
	fmt.Println(rowsHistory)
	if err != nil {
		panic(err)
	}
	defer rowsHistory.Close()
	arrOfHistoryTf := []domain.HistoryTransferForGetAll{}
	for rowsHistory.Next() {
		historyTf := &domain.HistoryTransferForGetAll{}
		if err := rowsHistory.Scan(
			&historyTf.Id,
			&historyTf.Sender,
			&historyTf.Receiver,
			&historyTf.Amount,
			&historyTf.IsRead,
			&historyTf.Status,
			&historyTf.CreatedAt,
		); err != nil {
			panic(err)
		}
		arrOfHistoryTf = append(arrOfHistoryTf, *historyTf)
	}
	return &arrOfHistoryTf, nil
}

func (tf *TransferRepository) GetHistoryTransferById(ctx context.Context, id int, userid int) (*domain.HistoryTransfer, error) {
	rowsHistory, err := tf.mysql.Db.QueryContext(ctx, "SELECT id, sender, receiver, notes, amount, isRead, status, sender_name, receiver_name, created_at, previous_balance, balance FROM history_transfer WHERE id = ? AND userId = ?", id, userid)
	if err != nil {
		panic(err)
	}
	defer rowsHistory.Close()
	history := &domain.HistoryTransfer{}
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
			&history.CreatedAt,
			&history.PreviousBalance,
			&history.Balance,
		); err != nil {
			panic(err)
		}
		return history, nil
	}
	return nil, sql.ErrNoRows
}

func (tf *TransferRepository) DeleteHistoryTransferById(tx *sql.Tx, ctx context.Context, id int, userid int) error {
	result, err := tx.ExecContext(ctx, "DELETE FROM history_transfer WHERE id = ? AND userId = ?", id, userid)
	if err != nil {
		panic(err)
	}
	affRows, _ := result.RowsAffected()
	if affRows == 0 {
		return errors.ErrNothingToDel
	}
	return nil
}

func (tf *TransferRepository) DeleteAllHistoryTransfer(tx *sql.Tx, ctx context.Context, userid int) error {
	result, err := tx.ExecContext(ctx, "DELETE FROM history_transfer WHERE userId = ?", userid)
	if err != nil {
		panic(err)
	}
	affRows, _ := result.RowsAffected()
	if affRows == 0 {
		return errors.ErrNothingToDel
	}
	return nil
}
