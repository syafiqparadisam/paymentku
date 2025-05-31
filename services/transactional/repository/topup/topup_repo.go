package topup_repo

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/go-redsync/redsync/v4"
	"github.com/syafiqparadisam/paymentku/services/transactional/domain"
	"github.com/syafiqparadisam/paymentku/services/transactional/errors"
)

func (t *TopUpRepository) StartTransaction(ctx context.Context) (*sql.Tx, error) {
	return t.mysql.Db.BeginTx(ctx, &sql.TxOptions{Isolation: sql.LevelReadCommitted})
}
func (t *TopUpRepository) DeleteUserCache(userID int, lockKey string) error {
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

func (s *TopUpRepository) FindBalanceById(tx *sql.Tx, ctx context.Context, userid int) (*domain.Balance, error) {
	// query to find user
	rows, err := tx.QueryContext(ctx, "select balance from users where id = ?", userid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	balance := &domain.Balance{}
	if rows.Next() {
		if err := rows.Scan(&balance.Balance); err != nil {
			return nil, err
		}
		fmt.Println(balance.Balance)
		return balance, nil
	}
	return nil, sql.ErrNoRows
}

func (s *TopUpRepository) IncreaseBalanceById(tx *sql.Tx, ctx context.Context, amount int, id int) error {
	// query to update balance
	result, err := tx.ExecContext(ctx, "update users set balance = balance + ?  where id = ?", amount, id)
	if err != nil {
		return err
	}
	executed, err := result.RowsAffected()
	fmt.Println(executed, err)
	if executed == 0 {
		return errors.ErrAffectedRows
	}
	if err != nil {
		return err
	}
	return nil
}

func (s *TopUpRepository) CreateTopUpHistory(ctx context.Context, entity *domain.CreateHistoryTopUp) error {
	result, err := s.mysql.Db.ExecContext(ctx, "INSERT INTO history_topup (amount, balance, previous_balance, status, userId, created_at) values (?, ?, ?, ?, ?, ?)", entity.Amount, entity.Balance, entity.PreviousBalance, entity.Status, entity.UserId, entity.CreatedAt)
	if err != nil {
		return err
	}
	executed, err := result.RowsAffected()
	fmt.Println(executed, err)
	if executed == 0 {
		return errors.ErrAffectedRows
	}
	if err != nil {
		return err
	}
	return nil
}
