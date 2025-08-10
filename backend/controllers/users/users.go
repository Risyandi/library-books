package users

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"library-books/config"
	"library-books/database/mongodb"
	"library-books/entity"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
)

var Validate *validator.Validate

type UsersController struct {
	Validate *validator.Validate
}

// RegisterHandler godoc
// @Summary Register a new user
// @Tags Authentication
// @Description API endpoint to register new users
// @Accept json
// @Produce json
// @Param user body entity.User true "User registration data"
// @Success 201 {object} helpers.Response "User registered successfully"
// @Failure 400 {object} helpers.Response "Invalid input or user already exists"
// @Failure 500 {object} helpers.Response "Database error"
// @Router /api/v1/auth/register [post]
func (h *UsersController) RegisterHandler(ctx *gin.Context) {
	var user entity.User

	if err := ctx.ShouldBindJSON(&user); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate input
	if err := h.Validate.Struct(user); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if username or MSISDN already exists
	count, err := mongodb.Database.Collection("users").CountDocuments(context.Background(), bson.M{"$or": []bson.M{{"msisdn": user.MSISDN}, {"username": user.Username}}})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	if count > 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Username or MSISDN already exists"})
		return
	}

	// Hash password
	hashedPassword := HashPassword(user.Password)
	user.Password = hashedPassword

	// Generate UUID for ID
	user.ID = GenerateUUID()

	// Store user in database
	_, err = mongodb.Database.Collection("users").InsertOne(context.Background(), user)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	ctx.Status(http.StatusCreated)
}

// LoginHandler godoc
// @Summary Login user and generate authentication token
// @Tags Authentication
// @Description API endpoint for user login to receive JWT token
// @Accept json
// @Produce json
// @Param user body entity.User true "User login data"
// @Success 200 {object} helpers.Response "Login successful, returns token and expiration"
// @Failure 400 {object} helpers.Response "Invalid input"
// @Failure 401 {object} helpers.Response "Invalid credentials"
// @Failure 500 {object} helpers.Response "Failed to generate token or database error"
// @Router /api/v1/auth/login [post]
func (h *UsersController) LoginHandler(ctx *gin.Context) {
	// Fetch user from database based on MSISDN and password
	var user entity.User

	config := config.ConfigViper()

	if err := ctx.ShouldBindJSON(&user); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate input
	if err := h.Validate.StructExcept(user, "Name", "ID", "Username"); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// found user in database
	var foundUser entity.User
	err := mongodb.Database.Collection("users").FindOne(context.Background(), bson.M{"msisdn": user.MSISDN, "password": HashPassword(user.Password)}).Decode(&foundUser)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// adding expire token 30 minutes
	claimCustom := entity.JWTClaims{
		ID: foundUser.ID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute * 30)), // Expires in 30 minutes
		},
	}

	// generate tokens string
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, claimCustom)

	tokenString, err := claims.SignedString([]byte(config.GetString("jwt.key")))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// parse token and get value of ExpireAt
	token, err := jwt.ParseWithClaims(tokenString, &entity.JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.GetString("jwt.key")), nil
	})

	if err != nil {
		fmt.Println(err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": err})
	} else if claims, ok := token.Claims.(*entity.JWTClaims); ok {
		ctx.JSON(http.StatusOK, gin.H{"token": tokenString, "expire_at": claims.RegisteredClaims.ExpiresAt})
	} else {
		fmt.Println("unknown claims type, cannot proceed")
		ctx.JSON(http.StatusNotFound, gin.H{"message": "unknown claims type, cannot proceed"})
	}
}

// ProfileHandler godoc
// @Summary Get user profile
// @Tags Authentication
// @Description API endpoint to get user profile based on JWT
// @Accept json
// @Produce json
// @Success 200 {object} helpers.Response "User profile retrieved successfully"
// @Failure 404 {object} helpers.Response "User not found"
// @Router /api/v1/auth/profile [get]
func (h *UsersController) ProfileHandler(ctx *gin.Context) {
	// Extract user ID from JWT
	claims := ctx.MustGet("claims").(jwt.MapClaims)
	userID := claims["id"].(string)

	// Fetch user from database
	var user entity.User
	err := mongodb.Database.Collection("users").FindOne(context.Background(), bson.M{"_id": userID}).Decode(&user)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"id": user.ID, "msisdn": user.MSISDN, "name": user.Name, "username": user.Username})
}

// function to generate UUID
func GenerateUUID() string {
	b := make([]byte, 16)
	_, err := rand.Read(b)
	if err != nil {
		panic(err)
	}
	return hex.EncodeToString(b)
}

// Helper function to hash password
func HashPassword(password string) string {
	hasher := sha256.New()
	hasher.Write([]byte(password))
	return hex.EncodeToString(hasher.Sum(nil))
}
