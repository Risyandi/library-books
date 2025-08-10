package books

import (
	"context"
	"library-books/constant"
	"library-books/database/mongodb"
	"library-books/entity"
	"library-books/helpers"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var Validate *validator.Validate

type BooksController struct {
	Validate *validator.Validate
}

// AddBookHandler godoc
// @Summary Add a new book
// @Description Add a new book to the library
// @Tags Books
// @Accept json
// @Produce json
// @Param book body entity.Book true "Book data"
// @Success 201 {object} helpers.Response "Book added successfully"
// @Failure 400 {object} helpers.Response "Invalid input"
// @Failure 500 {object} helpers.Response "Database error"
// @Router /books [post]
func (h *BooksController) AddBookHandler(ctx *gin.Context) {
	var book entity.Book
	if err := ctx.ShouldBindJSON(&book); err != nil {
		helpers.BadRequest(ctx, http.StatusBadRequest, constant.ErrorInvalidInput)
		return
	}

	// Validate input
	if err := h.Validate.Struct(book); err != nil {
		helpers.BadRequest(ctx, http.StatusBadRequest, constant.ErrorInvalidInput)
		return
	}

	// Insert courier data into database
	book.CreatedAt = time.Now().String()
	_, err := mongodb.Database.Collection("books").InsertOne(context.Background(), book)
	if err != nil {
		helpers.ServerError(ctx, http.StatusInternalServerError, constant.ErrorDatabase)
		return
	}

	helpers.Success(ctx, http.StatusCreated, constant.SuccessAddBook, nil)
}

// GetAllBookHandler godoc
// @Summary Get all books
// @Description Get all books from the library
// @Tags Books
// @Accept json
// @Produce json
// @Success 200 {object} helpers.Response "Books retrieved successfully"
// @Failure 500 {object} helpers.Response "Database error"
// @Router /books [get]
func (h *BooksController) GetAllBookHandler(ctx *gin.Context) {
	// Fetch books data from database
	var formdataBooks []entity.Book

	cursor, err := mongodb.Database.Collection("books").Find(context.Background(), bson.M{})
	if err != nil {
		helpers.ServerError(ctx, http.StatusInternalServerError, constant.ErrorDatabase)
		return
	}

	defer cursor.Close(context.Background())

	// Iterate over the cursor and decode each item into a new item variable
	for cursor.Next(context.Background()) {
		var itemBook entity.Book
		if err := cursor.Decode(&itemBook); err != nil {
			continue
		}
		formdataBooks = append(formdataBooks, itemBook)
	}

	// Check if there are any items
	lengthData := len(formdataBooks)
	if lengthData == 0 {
		helpers.NotFound(ctx, http.StatusNotFound, constant.NotfoundBook)
		return
	}

	helpers.Success(ctx, http.StatusOK, constant.SuccessGetBook, formdataBooks)
}

// GetBookHandler godoc
// @Summary Get a book by ID
// @Description Get a book by its ID from the library
// @Tags Books
// @Accept json
// @Produce json
// @Param id path string true "Book ID"
// @Success 200 {object} helpers.Response "Book retrieved successfully"
// @Failure 400 {object} helpers.Response "Invalid input"
// @Failure 404 {object} helpers.Response "Book not found"
// @Failure 500 {object} helpers.Response "Database error"
// @Router /books/{id} [get]
func (h *BooksController) GetBookHandler(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		helpers.BadRequest(ctx, http.StatusBadRequest, constant.ErrorInvalidInput)
		return
	}

	// Convert id string to MongoDB ObjectID
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		helpers.BadRequest(ctx, http.StatusBadRequest, constant.ErrorInvalidInput)
		return
	}

	var book entity.Book
	filter := bson.M{"_id": objectId}
	err = mongodb.Database.Collection("books").FindOne(context.Background(), filter).Decode(&book)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			helpers.NotFound(ctx, http.StatusNotFound, constant.NotfoundBook)
		} else {
			helpers.ServerError(ctx, http.StatusInternalServerError, constant.ErrorDatabase)
		}
		return
	}

	helpers.Success(ctx, http.StatusOK, constant.SuccessGetBook, book)
}

// UpdateBookHandler godoc
// @Summary Update a book by ID
// @Description Update a book by its ID in the library
// @Tags Books
// @Accept json
// @Produce json
// @Param id path string true "Book ID"
// @Param book body entity.Book true "Book data"
// @Success 200 {object} helpers.Response "Book updated successfully"
// @Failure 400 {object} helpers.Response "Invalid input"
// @Failure 404 {object} helpers.Response "Book not found"
// @Failure 500 {object} helpers.Response "Database error"
// @Router /books/{id} [put]
func (h *BooksController) UpdateBookHandler(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		helpers.BadRequest(ctx, http.StatusBadRequest, constant.ErrorInvalidInput)
		return
	}

	var book entity.Book
	if err := ctx.ShouldBindJSON(&book); err != nil {
		helpers.BadRequest(ctx, http.StatusBadRequest, constant.ErrorInvalidInput)
		return
	}

	// Validate input
	if err := h.Validate.Struct(book); err != nil {
		helpers.BadRequest(ctx, http.StatusBadRequest, constant.ErrorInvalidInput)
		return
	}

	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		helpers.BadRequest(ctx, http.StatusBadRequest, constant.ErrorInvalidInput)
		return
	}

	filter := bson.M{"_id": objectId}
	update := bson.M{"$set": book}
	result, err := mongodb.Database.Collection("books").UpdateOne(context.Background(), filter, update)
	if err != nil {
		helpers.ServerError(ctx, http.StatusInternalServerError, constant.ErrorDatabase)
		return
	}
	if result.MatchedCount == 0 {
		helpers.NotFound(ctx, http.StatusNotFound, constant.NotfoundBook)
		return
	}

	helpers.Success(ctx, http.StatusOK, constant.SuccessUpdateBook, nil)
}

// DeleteBookHandler godoc
// @Summary Delete a book by ID
// @Description Delete a book by its ID from the library
// @Tags Books
// @Accept json
// @Produce json
// @Param id path string true "Book ID"
// @Success 200 {object} helpers.Response "Book deleted successfully"
// @Failure 400 {object} helpers.Response "Invalid input"
// @Failure 404 {object} helpers.Response "Book not found"
// @Failure 500 {object} helpers.Response "Database error"
// @Router /books/{id} [delete]
func (h *BooksController) DeleteBookHandler(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		helpers.BadRequest(ctx, http.StatusBadRequest, constant.ErrorInvalidInput)
		return
	}

	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		helpers.BadRequest(ctx, http.StatusBadRequest, constant.ErrorInvalidInput)
		return
	}

	filter := bson.M{"_id": objectId}
	result, err := mongodb.Database.Collection("books").DeleteOne(context.Background(), filter)
	if err != nil {
		helpers.ServerError(ctx, http.StatusInternalServerError, constant.ErrorDatabase)
		return
	}
	if result.DeletedCount == 0 {
		helpers.NotFound(ctx, http.StatusNotFound, constant.NotfoundBook)
		return
	}

	helpers.Success(ctx, http.StatusOK, constant.SuccessDeleteBook, nil)
}
