package utils

import (
	"fmt"
	"strings"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func ParseURlParamsToObjectId(path string) (*primitive.ObjectID, error) {
	arrPath := strings.Split(path, "/")
	var idHistory *primitive.ObjectID
	fmt.Println(arrPath[2])
	if len(arrPath) == 3 {
		params := arrPath[2]
		toObjectId, err := primitive.ObjectIDFromHex(params)
		if err != nil {
			return nil, err
		}
		idHistory = &toObjectId
	} else {
		return nil, fmt.Errorf("params not found")
	}
	return idHistory, nil
}
