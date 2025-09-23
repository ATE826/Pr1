package handlers

import (
	"net/http"
	"pr1/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

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
