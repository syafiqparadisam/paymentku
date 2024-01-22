package mysqlrepo

import (
	"context"
	"database/sql"
	"fmt"
	"time"
)

type MySqlProvider interface {
	IncreaseBalanceByNameAndEmail(uint32, string, string) error
	FindBalanceByName(string) (*UserIdAndBalance, error)
	DecreaseBalanceByUser(uint32, string) error
	IncreaseBalanceByAccNumber(uint32, int64) error
	FindUserAndEmailByAccNumber(int64) (*UserAndEmail, error)
	FindAccNumByName(string) (*AccountNumber, error)
	FindNameAccNumAndEmailByAccNum(int64) (*UserAccNumAndEmail, error)
}

type UserAccNumAndEmail struct {
	User          string
	AccountNumber int64
}

type UserIdAndBalance struct {
	UserId  int
	Balance uint64
}

type UserAndEmail struct {
	User  string
	Email string
}

type AccountNumber struct {
	AccountNumber int64
}

type MySqlRepository struct {
	db *sql.DB
}

func (s *MySqlRepository) IncreaseBalanceByNameAndEmail(amount uint32, user, email string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	// query to update balance
	queryUpdateBalance := fmt.Sprintf(`update users set balance = balance + %d where user = '%s' and email = "%s";`, amount, user, email)
	result, err := s.db.ExecContext(ctx, queryUpdateBalance)
	if err != nil {
		return err
	}
	executed, err := result.RowsAffected()
	fmt.Println(executed, err)
	if executed == 0 {
		return fmt.Errorf("No content modified")
	}
	if err != nil {
		return err
	}
	return nil
}

func (s *MySqlRepository) FindBalanceByName(user string) (*UserIdAndBalance, error) {
	// query to find user
	ctxfind, cancelUser := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancelUser()
	queryFindUser := fmt.Sprintf("select id, balance from users where user = '%s';", user)
	fmt.Println(queryFindUser)
	rows, err := s.db.QueryContext(ctxfind, queryFindUser)
	if err != nil {
		return nil, err
	}
	fmt.Println("error will rows")
	userbalance := &UserIdAndBalance{}
	if rows.Next() {
		if err := rows.Scan(&userbalance.UserId, &userbalance.Balance); err != nil {
			return nil, err

		} else {
			fmt.Println("succesfully")
			return userbalance, nil
		}
	} else {
		return nil, fmt.Errorf("No content modified")
	}
}

func (s *MySqlRepository) DecreaseBalanceByUser(amount uint32, user string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	query := fmt.Sprintf("update users set balance = balance - %d where user = '%s';", amount, user)
	result, err := s.db.ExecContext(ctx, query)
	fmt.Println(query, err)
	if err != nil {
		return err
	}
	numAffected, err := result.RowsAffected()
	if (err != nil) || (numAffected == 0) {
		return fmt.Errorf("No content modified")
	}
	return nil
}

func (s *MySqlRepository) IncreaseBalanceByAccNumber(amount uint32, accNumber int64) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := fmt.Sprintf("update users set balance = balance + %d where accountNumber = %d;", amount, accNumber)
	result, err := s.db.ExecContext(ctx, query)

	if err != nil {
		return err
	}
	rowsAffect, errAffected := result.RowsAffected()
	if (rowsAffect == 0) || (errAffected != nil) {
		return fmt.Errorf("Account Number not found")
	}
	return nil
}

func (s *MySqlRepository) FindNameAccNumAndEmailByAccNum(accNumber int64) (*UserAccNumAndEmail, error) {
	ctx, cancelUser := context.WithTimeout(context.Background(), 3*time.Second)

	defer cancelUser()
	queryFindUser := fmt.Sprintf("SELECT user, accountNumber FROM users WHERE accountNumber = %d;", int(accNumber))
	fmt.Println(queryFindUser)
	rows, err := s.db.QueryContext(ctx, queryFindUser)
	if err != nil {
		return nil, err
	}

	userResult := &UserAccNumAndEmail{}
	if rows.Next() {

		if err := rows.Scan(&userResult.User, &userResult.AccountNumber); err != nil {
			return nil, err
		}
		return userResult, nil
	} else {

		return nil, fmt.Errorf("No content modified")
	}
}

func (s *MySqlRepository) FindUserAndEmailByAccNumber(accNumber int64) (*UserAndEmail, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := fmt.Sprintf("select user,email from users where accountNumber = %d", accNumber)
	rows, err := s.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}

	useremail := &UserAndEmail{}
	if rows.Next() {
		if err := rows.Scan(&useremail.User, &useremail.Email); err != nil {
			return nil, err
		}
		return useremail, nil
	}
	return nil, fmt.Errorf("No content modified")
}

func (s *MySqlRepository) FindAccNumByName(name string) (*AccountNumber, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	query := fmt.Sprintf("select accountNumber from users where user = '%s'", name)
	rows, err := s.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	accNum := &AccountNumber{}
	if rows.Next() {
		if err := rows.Scan(&accNum.AccountNumber); err != nil {
			return nil, err
		}
		fmt.Println(accNum.AccountNumber)
		return accNum, nil
	}
	return nil, fmt.Errorf("Not Found")
}
