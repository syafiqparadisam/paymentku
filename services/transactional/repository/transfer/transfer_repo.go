package transfer_repo

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/go-redsync/redsync/v4"
	"github.com/syafiqparadisam/paymentku/services/transactional/domain"
	"github.com/syafiqparadisam/paymentku/services/transactional/errors"
)

func (s *TransferRepository) StartTransaction(ctx context.Context) (*sql.Tx, error) {
	return s.mysql.Db.BeginTx(ctx, &sql.TxOptions{Isolation: sql.LevelReadCommitted})
}

func (t *TransferRepository) DeleteUserCache(userID int, lockKey string) error {
	// Buat distributed mutex berdasarkan lockKey
	mutex := t.redis.Rs.NewMutex(lockKey, redsync.WithExpiry(t.redisDuration))

	// Acquire lock
	if err := mutex.Lock(); err != nil {
		return fmt.Errorf("failed to acquire lock: %w", err)
	}
	defer func() {
		_, _ = mutex.Unlock()
	}()

	// Hapus cache Redis
	key := fmt.Sprintf("userprofile:%d", userID)
	if err := t.redis.Client.Del(t.redis.Ctx, key).Err(); err != nil {
		return fmt.Errorf("failed to delete redis key: %w", err)
	}

	return nil
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

func (s *TransferRepository) InsertTransferHistory(ctx context.Context, transfer *domain.CreateHistoryTransfer) error {
	result, err := s.mysql.Db.ExecContext(ctx, "INSERT INTO history_transfer (sender, sender_name, receiver, receiver_name, status, notes, amount, created_at,previous_balance, balance, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", transfer.Sender, transfer.SenderName, transfer.Receiver, transfer.ReceiverName, transfer.Status, transfer.Notes, transfer.Amount, transfer.CreatedAt, transfer.PreviousBalance, transfer.Balance, transfer.UserId)
	if err != nil {
		return err
	}
	rowsAffect, errAffected := result.RowsAffected()
	if (rowsAffect == 0) || (errAffected != nil) {
		return errors.ErrAffectedRows
	}
	return nil
}

func (s *TransferRepository) InsertToNotification(ctx context.Context, domain *domain.Notification) error {
	result, err := s.mysql.Db.ExecContext(ctx, "INSERT INTO notification (icon, title, description, type, userId, created_at) VALUES (?, ?, ?, ?, ?, ?);", domain.Icon, domain.Title, domain.Description, domain.Type, domain.UserId, domain.CreatedAt)
	if err != nil {
		return err
	}

	affRows, _ := result.RowsAffected()
	if affRows == 0 {
		return errors.ErrAffectedRows
	}
	return nil
}
