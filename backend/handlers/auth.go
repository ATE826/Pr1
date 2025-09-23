package handlers

import (
	"net/http"
	"pr1/models"
	"pr1/utils"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type RegisterInput struct {
	Role       string `json:"role" binding:"required,oneof=engineer manager supervisor employer"`
	FirstName  string `json:"first_name" binding:"required"`
	LastName   string `json:"last_name" binding:"required"`
	Patronymic string `json:"patronymic"`
	Email      string `json:"email" binding:"required,email"`
	Password   string `json:"password" binding:"required,min=6"`
}

type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func (s *Server) Register(c *gin.Context) {
	var input RegisterInput

	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	user := models.User{
		Role:       input.Role,
		FirstName:  input.FirstName,
		LastName:   input.LastName,
		Patronymic: input.Patronymic,
		Email:      input.Email,
		Password:   input.Password,
	}

	user.HashPassword()

	if err := s.db.Create(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "The user has been created", "id": user.ID})
}

func (s *Server) LoginCheck(email, password string) (string, error) {
	var err error

	user := models.User{}

	if err = s.db.Model(models.User{}).Where("email = ?", email).Take(&user).Error; err != nil {
		return "", err
	}

	err = user.VerifyPassword(password)

	if err != nil && err == bcrypt.ErrMismatchedHashAndPassword {
		return "", err
	}

	token, err := utils.GenerateToken(user)

	if err != nil {
		return "", err
	}

	return token, nil
}

func (s *Server) Login(c *gin.Context) {
	var input LoginInput

	// Валидация входных данных
	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Поиск пользователя по email
	var user models.User
	if err := s.db.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid email or password"})
		return
	}

	// Проверка пароля
	if err := user.VerifyPassword(input.Password); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid email or password"})
		return
	}

	// Генерация токена
	token, err := utils.GenerateToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	// Успешный ответ
	c.JSON(http.StatusOK, gin.H{"ID:": user.ID, "token": token})
}

func (s *Server) GetUser(c *gin.Context) {
	id := c.Param("id")

	var user models.User
	if err := s.db.First(&user, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch user"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":         user.ID,
		"role":       user.Role,
		"first_name": user.FirstName,
		"last_name":  user.LastName,
		"patronymic": user.Patronymic,
		"email":      user.Email,
		"created_at": user.CreatedAt,
	})
}
