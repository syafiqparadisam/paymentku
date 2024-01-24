package mysqluser

import "database/sql"

type MySqlRepository interface {
	
}

type MySqlStore struct {
	db *sql.DB
}
