package seeder

import (
	"fmt"

	"github.com/syafiqparadisam/paymentku/services/transactional/config"
)

type NotifSeeder struct {
	MySql *config.MySqlStore
}

type Notification struct {
	Id          int64
	Icon        string
	IsRead      int8
	Title       string
	CreatedAt   string
	Type        string
	UserId      int64
	Description string
}

func NewNotifSeeder(mysql *config.MySqlStore) *NotifSeeder {
	return &NotifSeeder{
		MySql: mysql,
	}
}

func (n *NotifSeeder) Find(idUser int64) *[]Notification {
	rows, err := n.MySql.Db.Query("SELECT * FROM notification WHERE userId = ?", idUser)
	if err != nil {
		panic(err)
	}
	arrNotif := []Notification{}
	for rows.Next() {
		notif := &Notification{}
		if err := rows.Scan(&notif.Id, &notif.Icon, &notif.IsRead, &notif.Title, &notif.Description, &notif.CreatedAt, &notif.Type, &notif.UserId); err != nil {
			panic(err)
		}
		arrNotif = append(arrNotif, *notif)
	}
	return &arrNotif
}

func (n *NotifSeeder) Down(idUser int64) {
	_, err := n.MySql.Db.Exec("DELETE FROM notification WHERE userId = ?", idUser)
	if err != nil {
		panic(err)
	}
	fmt.Println("Notification Seeder has been down")
}
