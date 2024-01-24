package mysqltransaction

import (
	"database/sql"
	"fmt"
	"os"
	_ "github.com/go-sql-driver/mysql"
)

func ConnectMySql() (*MySqlStore, error) {
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASS")
	port := os.Getenv("DB_PORT")
	dbname := os.Getenv("DB_DBNAME")
	// info := fmt.Sprintln(fmt.Sprintf("%s:%s@tcp(localhost:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", user, pass, port, dbname))
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(localhost:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", user, pass, port, dbname))

	if err != nil {
		return nil, err
	}
	errPingDb := db.Ping()
	if errPingDb != nil {
		return nil, errPingDb
	}
	fmt.Println("connected to mysql on port ", port)
	return &MySqlStore{db: db}, nil
}
