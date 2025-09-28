package handlers

import (
	"net/http"
	"pr1/models"

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

	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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

	c.JSON(http.StatusCreated, gin.H{"message": "The defect has been created", "id": defect.ID})
}

func (s *Server) GetDefects(c *gin.Context) {
	var defects []models.Defect
	if err := s.db.Preload("Attachments").Find(&defects).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot get defects"})
		return
	}
	c.JSON(http.StatusOK, defects)
}

func (s *Server) GetDefectByID(c *gin.Context) {
	id := c.Param("id")

	var defect models.Defect

	if err := s.db.Preload("Attachments").First(&defect, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Defect not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error while getting defect"})
		return
	}

	c.JSON(http.StatusOK, defect)
}

func (s *Server) UpdateDefect(c *gin.Context) {
	id := c.Param("id")

	var defect models.Defect
	if err := s.db.First(&defect, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Defect not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error while getting defect"})
		return
	}

	var input struct {
		Title       string `json:"title" binding:"required"`
		Description string `json:"description" binding:"required"`
		Status      string `json:"status" binding:"required,oneof=new in_progress checking canceled completed"`
		Priority    string `json:"priority" binding:"required,oneof=low medium high"`
		Deadline    string `json:"deadline" binding:"required,datetime=2006-01-02"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	defect.Title = input.Title
	defect.Description = input.Description
	defect.Status = input.Status
	defect.Priority = input.Priority
	defect.Deadline = input.Deadline

	if err := s.db.Save(&defect).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating defect"})
		return
	}

	c.JSON(http.StatusOK, defect)
}

func (s *Server) DeleteDefect(c *gin.Context) {
	id := c.Param("id")

	var defect models.Defect
	if err := s.db.First(&defect, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Defect not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching defect"})
		return
	}

	if err := s.db.Delete(&defect).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting defect"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Defect successfully deleted"})
}
