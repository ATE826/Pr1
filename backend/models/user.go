package models

import (
	"html"
	"strings"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Role       string `gorm:"not null" json:"role"`
	FirstName  string `gorm:"not null" json:"first_name"`
	LastName   string `gorm:"not null" json:"last_name"`
	Patronymic string `json:"patronymic"`
	Email      string `gorm:"unique;not null" json:"email"`
	Password   string `gorm:"not null" json:"password"`
}

func (u *User) HashPassword() error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)

	if err != nil {
		return err
	}

	u.FirstName = html.EscapeString(strings.TrimSpace(u.FirstName))
	u.LastName = html.EscapeString(strings.TrimSpace(u.LastName))
	u.Patronymic = html.EscapeString(strings.TrimSpace(u.Patronymic))
	u.Email = html.EscapeString(strings.TrimSpace(u.Email))
	u.Password = string(hashedPassword)

	return nil
}

func (u *User) VerifyPassword(password string) error {
	return bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
}
