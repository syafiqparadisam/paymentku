package user_repo

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/syafiqparadisam/paymentku/services/user/config"
	"github.com/syafiqparadisam/paymentku/services/user/domain"
	"github.com/syafiqparadisam/paymentku/services/user/errors"
)

type UserRepository struct {
	mysql *config.MySqlStore
}

func NewUserRepository(mysql *config.MySqlStore) *UserRepository {
	return &UserRepository{mysql}
}

type UserInterface interface {
	StartACID(ctx context.Context) (*sql.Tx, error)
	GetProfile(ctx context.Context, userid int) (*domain.Profile, error)
	GetUserProfileByAccNumber(ctx context.Context, accNumber uint64) (*domain.ProfileForFindWithAccount, error)
	UpdateBioProfile(ctx context.Context, userid int, bio string) error
	UpdateNameProfile(ctx context.Context, userid int, name string) error
	UpdatePhoneNumber(ctx context.Context, userid int, phoneNumber string) error
	GetPhotoProfile(ctx context.Context, userid int) (*domain.PhotoProfile, error)
}

func (s *UserRepository) StartACID(ctx context.Context) (*sql.Tx, error) {
	return s.mysql.Db.BeginTx(ctx, &sql.TxOptions{Isolation: sql.LevelReadCommitted})
}

func (s *UserRepository) GetProfile(ctx context.Context, userid int) (*domain.Profile, error) {

	row, err := s.mysql.Db.QueryContext(ctx, "SELECT user,email,accountNumber, phone_number, balance, created_at,name,bio,photo_profile,photo_public_id FROM users INNER JOIN profile ON users.profileId = profile.id WHERE users.id = ?", userid)
	if err != nil {
		return nil, err
	}
	defer row.Close()
	profile := &domain.Profile{}
	if row.Next() {
		if err := row.Err(); err != nil {
			return nil, err
		}
		if err := row.Scan(&profile.User, &profile.Email, &profile.AccountNumber, &profile.PhoneNumber, &profile.Balance, &profile.CreatedAt, &profile.Name, &profile.Bio, &profile.PhotoProfile, &profile.PhotoPublicId); err != nil {
			return nil, err
		}
		return profile, nil
	}
	return nil, sql.ErrNoRows
}

func (s *UserRepository) GetUserProfileByAccNumber(ctx context.Context, accNumber uint64) (*domain.ProfileForFindWithAccount, error) {
	row, err := s.mysql.Db.QueryContext(ctx, "SELECT user, accountNumber, created_at, name, photo_profile FROM users INNER JOIN profile ON users.profileId = profile.id WHERE users.accountNumber = ?", accNumber)
	if err != nil {
		return nil, err
	}
	defer row.Close()
	profile := &domain.ProfileForFindWithAccount{}
	if row.Next() {
		if err := row.Err(); err != nil {
			return nil, err
		}
		if err := row.Scan(&profile.User, &profile.AccountNumber, &profile.CreatedAt, &profile.Name, &profile.PhotoProfile); err != nil {
			return nil, err
		}
		return profile, nil
	}
	return nil, sql.ErrNoRows
}

func (s *UserRepository) UpdateBioProfile(ctx context.Context, userid int, bio string) error {
	result, err := s.mysql.Db.ExecContext(ctx, "UPDATE profile SET bio = ?	WHERE id = (SELECT profileId FROM users WHERE id = ?);", bio, userid)
	if err != nil {
		return err
	}
	aff, _ := result.RowsAffected()
	if aff == 0 {
		return errors.ErrAffectedRows
	}
	return nil
}

func (s *UserRepository) UpdateNameProfile(ctx context.Context, userid int, name string) error {
	query := fmt.Sprintf(`UPDATE profile
    SET name = "%s"
    WHERE id = (SELECT profileId FROM users WHERE id = %d);`, name, userid)
	result, err := s.mysql.Db.ExecContext(ctx, query)
	if err != nil {
		return err
	}
	aff, _ := result.RowsAffected()
	if aff == 0 {
		return errors.ErrAffectedRows
	}
	return nil
}

func (s *UserRepository) UpdatePhoneNumber(ctx context.Context, userid int, phoneNumber string) error {
	query := fmt.Sprintf(`UPDATE profile
    SET phone_number = "%s"
    WHERE id = (SELECT profileId FROM users WHERE id = %d);`, phoneNumber, userid)
	result, err := s.mysql.Db.ExecContext(ctx, query)
	if err != nil {
		return err
	}
	aff, _ := result.RowsAffected()
	if aff == 0 {
		return errors.ErrAffectedRows
	}
	return nil
}

func (s *UserRepository) GetPhotoProfile(ctx context.Context, userid int) (*domain.PhotoProfile, error) {
	query := fmt.Sprintf(`SELECT photo_profile FROM users INNER JOIN profile ON users.profileId = profile.id WHERE users.id = %d`, userid)
	row, err := s.mysql.Db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer row.Close()
	photoProfile := &domain.PhotoProfile{}
	if row.Next() {
		if err := row.Err(); err != nil {
			return nil, err
		}
		if err := row.Scan(photoProfile.PhotoProfile); err != nil {
			return nil, err
		}
		return photoProfile, nil
	}
	return nil, sql.ErrNoRows
}
