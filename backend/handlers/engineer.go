package handlers

import (
	"net/http"
	"pr1/models"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type DefectInput struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
	Status      string `json:"status" binding:"required,oneof=new in_progress checking canceled completed"`
	Priority    string `json:"priority" binding:"required,oneof=low medium high"`
	Deadline    string `json:"deadline" binding:"required,datetime=2006-01-02"`
}

func (s *Server) CreateDefect(c *gin.Context) {
	var input DefectInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user_id not found"})
		return
	}

	defect := models.Defect{
		Title:       input.Title,
		Description: input.Description,
		Status:      input.Status,
		Priority:    input.Priority,
		Deadline:    input.Deadline,
	}

	if err := s.db.Create(&defect).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "The defect has been created", "defect_id": defect.ID, "created_by": userID})
}

func (s *Server) GetAllDefects(c *gin.Context) {
	var defects []models.Defect
	if err := s.db.Find(&defects).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch defects"})
		return
	}
	c.JSON(http.StatusOK, defects)
}

func (s *Server) GetDefectByID(c *gin.Context) {
	id := c.Param("id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid defect ID"})
		return
	}

	var defect models.Defect

	if err := s.db.First(&defect, idUint).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "defect not found"})
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch defect"})

		return
	}
	c.JSON(http.StatusOK, defect)
}

func (s *Server) EditDefect(c *gin.Context) {
	id := c.Param("id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid defect ID"})
		return
	}

	var input DefectInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var defect models.Defect
	if err := s.db.First(&defect, idUint).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "defect not found"})
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch defect"})

		return
	}

	defect.Title = input.Title
	defect.Description = input.Description
	defect.Status = input.Status
	defect.Priority = input.Priority
	defect.Deadline = input.Deadline

	if err := s.db.Save(&defect).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update defect"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "The defect has been updated"})
}

func (s *Server) DeleteDefect(c *gin.Context) {
	id := c.Param("id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid defect ID"})
		return
	}

	if err := s.db.Delete(&models.Defect{}, idUint).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete defect"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "The defect has been deleted"})
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
