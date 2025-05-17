package domain

import (
	"fmt"
	"os"
	"time"
)

type Notification struct {
	Icon        string
	Title       string
	Description string
	Type        string
	UserId      int
	CreatedAt   string
}

func NewNotification(receiverid int, domain *CreateHistoryTransfer, receiver *UserInfo) *Notification {
	findIcon := os.Getenv("TF_ICON")
	types := "transfer"
	desc := fmt.Sprintf("You got transfer from %s, Amount: %d, Sender: %s,  Sendername: %s , Notes: %s , Yourbalance: %d", domain.Sender, domain.Amount, domain.Sender, domain.SenderName, domain.Notes, receiver.Balance+int64(domain.Amount))
	
	title := fmt.Sprintf("Congratulalation, you got transfer from %s", domain.Sender)
	return &Notification{
		Icon:        findIcon,
		UserId:      receiverid,
		Title:       title,
		Type:        types,
		Description: desc,
		CreatedAt:   time.Now().UTC().Format("2006-01-02T15:04:05.999Z"),
	}
}
