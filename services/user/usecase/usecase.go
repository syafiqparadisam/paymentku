package usecase

import (
	"context"

	"github.com/go-redis/redis/v8"
	"github.com/syafiqparadisam/paymentku/services/user/domain"
	"github.com/syafiqparadisam/paymentku/services/user/dto"
	user_repo "github.com/syafiqparadisam/paymentku/services/user/repository/user"
)

type Usecase struct {
	User *user_repo.UserRepository
	Redis *redis.Client
}

func NewUserUsecase(User *user_repo.UserRepository, redisClient *redis.Client) *Usecase {
	return &Usecase{
		User: User,
		Redis: redisClient,
	}
}

type UsecaseInterface interface {
	GetUserProfile(ctx context.Context, userid string) dto.APIResponse[*domain.Profile]
	GetUserProfileByAccNumber(ctx context.Context, dto *dto.FindUserByAccNumber) dto.APIResponse[*domain.ProfileForFindWithAccount]
	UpdateBio(ctx context.Context, dto *dto.UpdateBioDTO, userid string) dto.APIResponse[interface{}]
	UpdateName(ctx context.Context, dto *dto.UpdateNameDTO, userid string) dto.APIResponse[interface{}]
	UpdatePhoneNumber(ctx context.Context, dto *dto.UpdatePhoneNumberDTO, userid string) dto.APIResponse[interface{}]
}
