package handlers

import (
	"net/http"
	"pr1/models"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ========== Объекты ==========
func (s *Server) GetAllObjects(c *gin.Context) { // Протестировать
	var objects []models.Object

	if err := s.db.Find(&objects).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch objects"})
		return
	}
	c.JSON(http.StatusOK, objects)
}

func (s *Server) GetObjectByID(c *gin.Context) { // Протестировать
	id := c.Param("object_id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid object ID"})
		return
	}

	var object models.Object
	if err := s.db.First(&object, idUint).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "object not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch object"})
		}
		return
	}
	c.JSON(http.StatusOK, object)
}

func (s *Server) GetCurrentUser(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user_id not found"})
		return
	}

	var user models.User
	if err := s.db.First(&user, userID).Error; err != nil {
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

// ========== Дефекты ==========

func (s *Server) GetDefectByID(c *gin.Context) {

}

func (s *Server) GetAllDefects(c *gin.Context) {

}
