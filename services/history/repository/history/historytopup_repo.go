package history_repo

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/syafiqparadisam/paymentku/services/history/config"
	"github.com/syafiqparadisam/paymentku/services/history/domain"
	"github.com/syafiqparadisam/paymentku/services/history/errors"
)

type TopUpRepository struct {
	mysql *config.MySqlStore
}

func NewTopUpRepository(mysql *config.MySqlStore) *TopUpRepository {
	return &TopUpRepository{mysql: mysql}
}

type TopUpInterface interface {
	GetAllHistoryTopUp(ctx context.Context, userid int) (*[]domain.HistoryTopUpForGetAll, error)
	GetHistoryTopUpById(ctx context.Context, id int, userid int) (*domain.HistoryTopUp, error)
	DeleteAllHistoryTopUp(tx *sql.Tx, ctx context.Context, userid int) error
	UpdateIsRead(ctx context.Context, id int) error
	StartACID(ctx context.Context) (*sql.Tx, error)
	FindIsRead(ctx context.Context, id int) (*domain.IsRead, error)
	DeleteHistoryTopUpById(tx *sql.Tx, ctx context.Context, id int, userid int) error
}

func (tp *TopUpRepository) StartACID(ctx context.Context) (*sql.Tx, error) {
	return tp.mysql.Db.BeginTx(ctx, &sql.TxOptions{Isolation: sql.LevelReadCommitted})
}

func (tp *TopUpRepository) FindIsRead(ctx context.Context, id int) (*domain.IsRead, error) {
	rows, err := tp.mysql.Db.QueryContext(ctx, "SELECT isRead FROM history_topup WHERE id = ?", id)
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

func (tp *TopUpRepository) UpdateIsRead(ctx context.Context, id int) error {
	result, err := tp.mysql.Db.ExecContext(ctx, "UPDATE history_topup SET isRead = 1 WHERE id = ?", id)
	if err != nil {
		panic(err)
	}
	affRows, _ := result.RowsAffected()
	if affRows == 0 {
		return errors.ErrAffectedRows
	}
	return nil
}

func (tp *TopUpRepository) GetAllHistoryTopUp(ctx context.Context, userid int) (*[]domain.HistoryTopUpForGetAll, error) {
	rowsHistory, err := tp.mysql.Db.QueryContext(ctx, "SELECT history_topup.id, amount, isRead, status, history_topup.created_at FROM history_topup INNER JOIN users ON history_topup.userId = users.id WHERE history_topup.userId = ? ORDER BY history_topup.created_at DESC", userid)
	fmt.Println(rowsHistory)

	if err != nil {
		panic(err)
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

func (tp *TopUpRepository) GetHistoryTopUpById(ctx context.Context, id int, userid int) (*domain.HistoryTopUp, error) {
	rowsHistory, err := tp.mysql.Db.QueryContext(ctx, "SELECT id, amount, balance, previous_balance, isRead, status, created_at FROM history_topup WHERE id = ? AND userId = ? FOR UPDATE", id, userid)

	if err != nil {
		panic(err)
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

func (tp *TopUpRepository) DeleteAllHistoryTopUp(tx *sql.Tx, ctx context.Context, userid int) error {
	result, err := tx.ExecContext(ctx, "DELETE FROM history_topup WHERE userId = ?", userid)
	if err != nil {
		panic(err)
	}
	affRows, _ := result.RowsAffected()
	if affRows == 0 {
		return errors.ErrNothingToDel
	}
	return nil
}

func (tp *TopUpRepository) DeleteHistoryTopUpById(tx *sql.Tx, ctx context.Context, id int, userid int) error {
	result, err := tx.ExecContext(ctx, "DELETE FROM history_topup WHERE id = ? AND userId = ?", id, userid)
	if err != nil {
		panic(err)
	}
	affRows, _ := result.RowsAffected()
	if affRows == 0 {
		return errors.ErrNothingToDel
	}
	return nil
}
