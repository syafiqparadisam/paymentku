package usecase

import (
	"context"

	"github.com/syafiqparadisam/paymentku/services/user/domain"
	"github.com/syafiqparadisam/paymentku/services/user/dto"
	caching_repo "github.com/syafiqparadisam/paymentku/services/user/repository/caching"
	user_repo "github.com/syafiqparadisam/paymentku/services/user/repository/user"
)

type Usecase struct {
	User user_repo.UserInterface
	Cache caching_repo.CachingInterface
}

func NewUserUsecase(User user_repo.UserInterface, cache caching_repo.CachingInterface) *Usecase {
	return &Usecase{
		User: User,
		Cache: cache,
	}
}

type UsecaseInterface interface {
	GetUserProfile(ctx context.Context, userid string) dto.APIResponse[*domain.Profile]
	GetUserProfileByAccNumber(ctx context.Context, dto *dto.FindUserByAccNumber) dto.APIResponse[*domain.ProfileForFindWithAccount]
	UpdateBio(ctx context.Context, dto *dto.UpdateBioDTO, userid string) dto.APIResponse[interface{}]
	UpdateName(ctx context.Context, dto *dto.UpdateNameDTO, userid string) dto.APIResponse[interface{}]
	UpdatePhoneNumber(ctx context.Context, dto *dto.UpdatePhoneNumberDTO, userid string) dto.APIResponse[interface{}]
}
