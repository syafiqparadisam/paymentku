package main

import (
	"fmt"
	"log"

	"github.com/joho/godotenv"
	"github.com/syafiqparadisam/paymentku/domain/transaction"
)

func Initialization() {
	if err := godotenv.Load(".env"); err != nil {
		fmt.Println("Failed to load env file")
	}
}

func main() {
	Initialization()

	// transaction server is running ?
	// var wg sync.WaitGroup
	// go func(wg *sync.WaitGroup) {
	// 	wg.Add(1)
	// 	defer wg.Done()
	if err := transaction.TransactionServer(":8802"); err != nil {
		log.Fatal(err)
	}
	// }(&wg)
	// wg.Wait()
	// time.Sleep(4 * time.Second)
}
