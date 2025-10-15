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
	objectIDParam := c.Param("object_id")
	objectID, err := strconv.ParseUint(objectIDParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid object ID"})
		return
	}

	var input ObjectInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var object models.Object
	if err := s.db.First(&object, objectID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "object not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch object"})
		return
	}

	// Обновляем только поля, которые менеджер может менять
	if input.Title != "" {
		object.Title = input.Title
	}
	if input.Description != "" {
		object.Description = input.Description
	}
	if input.Location != "" {
		object.Location = input.Location
	}
	if input.StartDate != "" {
		object.StartDate = input.StartDate
	}
	if input.EndDate != "" {
		object.EndDate = input.EndDate
	}
	if input.Status != "" {
		object.Status = input.Status
	}

	if err := s.db.Save(&object).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update object"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Object has been updated",
		"object_id": object.ID,
	})
}

func (s *Server) DeleteObject(c *gin.Context) {
	objectIDParam := c.Param("object_id")
	objectID, err := strconv.ParseUint(objectIDParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid object ID"})
		return
	}

	// Удаляем объект. Внешние ключи GORM с `OnDelete:CASCADE` удалят дефекты автоматически
	if err := s.db.Delete(&models.Object{}, objectID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete object"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Object has been deleted"})
}

// ========== Дефекты ==========

func (s *Server) DeleteDefect(c *gin.Context) {
	objectIDParam := c.Param("object_id")
	defectIDParam := c.Param("defect_id")

	objectID, err := strconv.ParseUint(objectIDParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid object ID"})
		return
	}
	defectID, err := strconv.ParseUint(defectIDParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid defect ID"})
		return
	}

	var defect models.Defect
	if err := s.db.First(&defect, defectID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "defect not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch defect"})
		return
	}

	if defect.ObjectID != uint(objectID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "this defect does not belong to the specified object"})
		return
	}

	if err := s.db.Delete(&defect).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete defect"})
		return
	}

	// Уменьшаем count_of_defects у объекта
	s.db.Model(&models.Object{}).Where("id = ?", objectID).Update("count_of_defects", gorm.Expr("count_of_defects - ?", 1))

	c.JSON(http.StatusOK, gin.H{"message": "Defect has been deleted"})
}

func (s *Server) EditDefectByManager(c *gin.Context) {
	objectIDParam := c.Param("object_id")
	defectIDParam := c.Param("defect_id")

	objectID, err := strconv.ParseUint(objectIDParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid object ID"})
		return
	}
	defectID, err := strconv.ParseUint(defectIDParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid defect ID"})
		return
	}

	var defect models.Defect
	if err := s.db.First(&defect, defectID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "defect not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch defect"})
		return
	}

	if defect.ObjectID != uint(objectID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "this defect does not belong to the specified object"})
		return
	}

	var input DefectInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.Priority != "" {
		defect.Priority = input.Priority
	}
	if input.Deadline != "" {
		defect.Deadline = input.Deadline
	}

	if err := s.db.Save(&defect).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update defect"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Defect has been updated",
		"defect_id": defect.ID,
		"object_id": defect.ObjectID,
	})
}
