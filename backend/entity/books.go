package entity

type Book struct {
	Title         string `json:"title" bson:"title" validate:"required"`
	Author        string `json:"author" bson:"author" validate:"required"`
	Year          int    `json:"year" bson:"year" validate:"required"`
	ISBN          string `json:"isbn" bson:"isbn" validate:"required"`
	Genre         string `json:"genre" bson:"genre" validate:"required"`
	Description   string `json:"description" bson:"description" validate:"required"`
	CoverImageUrl string `json:"coverImageUrl" bson:"coverImageUrl" validate:"required"`
	// CreatedAt     string `json:"createdAt" bson:"createdAt"`
	// UpdatedAt     string `json:"updatedAt" bson:"updatedAt"`
}
