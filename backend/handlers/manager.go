package handlers

import (
	"net/http"
	"pr1/models"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ========== Объекты ==========

func (s *Server) CreateObject(c *gin.Context) {
	var input ObjectInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	object := models.Object{
		Title:       input.Title,
		Description: input.Description,
		Location:    input.Location,
		StartDate:   input.StartDate,
		EndDate:     input.EndDate,
		Status:      "active",
	}
	if err := s.db.Create(&object).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "The object has been created", "object_id": object.ID})
}

func (s *Server) EditObject(c *gin.Context) {

}

func (s *Server) DeleteObject(c *gin.Context) {

}

// ========== Дефекты ==========

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

func (s *Server) EditDefectByManager(c *gin.Context) {
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

	defect.Priority = input.Priority
	defect.Deadline = input.Deadline

	if err := s.db.Save(&defect).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update defect"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "The defect has been updated"})
}
