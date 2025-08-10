package entity

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Book struct {
	Title         string `json:"title" bson:"title" validate:"required"`
	Author        string `json:"author" bson:"author" validate:"required"`
	Year          string `json:"year" bson:"year" validate:"required"`
	ISBN          string `json:"isbn" bson:"isbn"`
	Genre         string `json:"genre" bson:"genre"`
	Description   string `json:"description" bson:"description"`
	CoverImageUrl string `json:"coverImageUrl" bson:"coverImageUrl"`
	CreatedAt     string `json:"createdAt" bson:"createdAt"`
	UpdatedAt     string `json:"updatedAt" bson:"updatedAt"`
}

type Books struct {
	ID            primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Title         string             `json:"title" bson:"title" validate:"required"`
	Author        string             `json:"author" bson:"author" validate:"required"`
	Year          string             `json:"year" bson:"year" validate:"required"`
	ISBN          string             `json:"isbn" bson:"isbn"`
	Genre         string             `json:"genre" bson:"genre"`
	Description   string             `json:"description" bson:"description"`
	CoverImageUrl string             `json:"coverImageUrl" bson:"coverImageUrl"`
	CreatedAt     string             `json:"createdAt" bson:"createdAt"`
	UpdatedAt     string             `json:"updatedAt" bson:"updatedAt"`
}
