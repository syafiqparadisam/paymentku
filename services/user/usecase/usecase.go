package usecase

import (
	"github.com/syafiqparadisam/paymentku/services/user/domain"
	"github.com/syafiqparadisam/paymentku/services/user/dto"
	user_repo "github.com/syafiqparadisam/paymentku/services/user/repository/user"
)

type Usecase struct {
	User *user_repo.UserRepository
}

func NewUserUsecase(User *user_repo.UserRepository) *Usecase {
	return &Usecase{
		User: User,
	}
}

type UsecaseInterface interface {
	GetUserProfile(userid string) dto.APIResponse[*domain.Profile]
	GetUserProfileByAccNumber(dto *dto.FindUserByAccNumber) dto.APIResponse[*domain.ProfileForFindWithAccount]
	UpdateBio(dto *dto.UpdateBioDTO, userid string) dto.APIResponse[interface{}]
	UpdateName(dto *dto.UpdateNameDTO, userid string) dto.APIResponse[interface{}]
	UpdatePhoneNumber(dto *dto.UpdatePhoneNumberDTO, userid string) dto.APIResponse[interface{}]
}
