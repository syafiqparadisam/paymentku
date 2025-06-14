package transfer_repo

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/syafiqparadisam/paymentku/services/transactional/config"
	"github.com/syafiqparadisam/paymentku/services/transactional/domain"
	"github.com/syafiqparadisam/paymentku/services/transactional/errors"
)

type TransferRepository struct {
	mysql *config.MySqlStore
	redis *config.RedisStore
	redisDuration time.Duration
}

func NewTransferRepository(mysql *config.MySqlStore, redis *config.RedisStore) *TransferRepository {
	return &TransferRepository{mysql: mysql, redis: redis, redisDuration: time.Second * 2}
}

type TransferInterface interface {
	GetHistoryTransferById(ctx context.Context, id int, userid int) (*domain.GetHistoryTransferById, error)
	GetAllHistoryTransfer(ctx context.Context, userid int) (*[]domain.GetHistoryTransfers, error)
	DeleteAllHistoryTransfer(tx *sql.Tx, ctx context.Context, userid int) error
	UpdateIsRead(ctx context.Context, id int) error
	FindIsRead(ctx context.Context, id int) (*domain.IsRead, error)
	DeleteHistoryTransferById(tx *sql.Tx, ctx context.Context, id int, userid int) error
	FindUsersById(tx *sql.Tx, ctx context.Context, id int) (*domain.UserInfo, error)
	DecreaseBalanceById(tx *sql.Tx, ctx context.Context, amount uint, userid int) error
	IncreaseBalanceByAccNumber(tx *sql.Tx, ctx context.Context, amount uint, accNum uint64) error
	FindUserByAccNum(tx *sql.Tx, ctx context.Context, accNum uint64) (*domain.UserInfo, error)
	InsertTransferHistory(ctx context.Context, domain *domain.CreateHistoryTransfer) error
	StartTransaction(ctx context.Context) (*sql.Tx, error)
	InsertToNotification(ctx context.Context, domain *domain.Notification) error
	DeleteUserCache(userID int, lockKey string) error
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

func (tf *TransferRepository) GetAllHistoryTransfer(ctx context.Context, userid int) (*[]domain.GetHistoryTransfers, error) {
	rowsHistory, err := tf.mysql.Db.QueryContext(ctx, "SELECT id, sender, receiver, amount, isRead, status, created_at FROM history_transfer WHERE userId = ? ORDER BY created_at DESC", userid)
	fmt.Println(rowsHistory)
	if err != nil {
		panic(err)
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
			panic(err)
		}
		arrOfHistoryTf = append(arrOfHistoryTf, *historyTf)
	}
	return &arrOfHistoryTf, nil
}

func (tf *TransferRepository) GetHistoryTransferById(ctx context.Context, id int, userid int) (*domain.GetHistoryTransferById, error) {
	rowsHistory, err := tf.mysql.Db.QueryContext(ctx, "SELECT id, sender, receiver, notes, amount, isRead, status, sender_name, receiver_name, created_at, previous_balance, balance FROM history_transfer WHERE id = ? AND userId = ?", id, userid)
	if err != nil {
		panic(err)
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
