package backup

import (
	"fmt"
	"os"
	"os/exec"
	"time"
)

// BackupDatabase делает дамп PostgreSQL и сохраняет в ./backups/
func BackupDatabase() error {
	backupDir := "./backups"
	if err := os.MkdirAll(backupDir, 0755); err != nil {
		return err
	}

	timestamp := time.Now().Format("2006-01-02_15-04-05")
	fileName := fmt.Sprintf("%s/backup_%s.sql", backupDir, timestamp)

	cmd := exec.Command(
		"pg_dump",
		"-h", os.Getenv("DB_HOST"),
		"-p", os.Getenv("DB_PORT"),
		"-U", os.Getenv("DB_USER"),
		"-d", os.Getenv("DB_NAME"),
		"-f", fileName,
	)

	// передаём пароль через окружение
	cmd.Env = append(os.Environ(), "PGPASSWORD="+os.Getenv("DB_PASSWORD"))

	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("ошибка бэкапа: %v\n%s", err, string(output))
	}

	fmt.Println("✅ Бэкап создан:", fileName)
	return nil
}
