package utils

import (
	"fmt"
	"net/http"
	"os"
	"path"
	"time"
)

func Logger(r *http.Request, start time.Time) {
	pathFile := path.Join("logs", "app.log")
	date := time.Now().Format("2006-01-02 15:04:05")
	fmt.Println(start)
	logs := fmt.Sprintf("%s\n\t METHOD: %s, url: %s, duration: %d,", date, r.Method, r.URL, start.Second())
	file, err := os.OpenFile(pathFile, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		fmt.Println("ERROR WHILE OPEN FILE", pathFile, err)
	}
	defer file.Close()
	if _, err := file.WriteString(logs); err != nil {
		fmt.Println("Error While Writing Log", err)
	}

}
