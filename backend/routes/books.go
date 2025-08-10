package routes

import (
	"library-books/controllers/books"

	"github.com/gin-gonic/gin"
)

func BooksRoutes(route *gin.RouterGroup, booksController *books.BooksController) {
	route.POST("/books", booksController.AddBookHandler)
	route.GET("/books", booksController.GetAllBookHandler)
	route.GET("/books/:id", booksController.GetBookHandler)
	route.PUT("/books/:id", booksController.UpdateBookHandler)
	route.DELETE("/books/:id", booksController.DeleteBookHandler)
}
