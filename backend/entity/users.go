package entity

import (
	"github.com/golang-jwt/jwt/v5"
)

// User model
type User struct {
	ID       string `json:"id" bson:"_id"`
	MSISDN   string `json:"msisdn" bson:"msisdn" validate:"required,len=12,numeric,startswith=62"`
	Name     string `json:"name" bson:"name" validate:"required"`
	Username string `json:"username" bson:"username" validate:"required"`
	Password string `json:"password,omitempty" bson:"password" validate:"required"`
}

// JWTClaims represents the claims of JWT
type JWTClaims struct {
	ID string `json:"id"`
	jwt.RegisteredClaims
}
