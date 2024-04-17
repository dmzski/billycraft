package todos

import (
	"back/database"
	"back/internal/lib/dtos"
	"back/internal/lib/models"
	"log"
	"time"
)

type TodoDao struct {
}

func (dao TodoDao) FindAllByTenant(tenant string) (todos []models.Todo) {
	if err := database.DBConn.Find(&todos, "company_id = ? ORDER BY created_at desc", tenant).Error; err != nil {
		panic(err)
	}
	return
}

func (dao TodoDao) FindAllByTenantAndIsDone(tenant string) (todos []models.Todo) {
	if err := database.DBConn.Find(&todos, "company_id = ? AND done_at IS NOT NULL ORDER BY created_at desc", tenant).Error; err != nil {
		panic(err)
	}
	return
}

func (dao TodoDao) FindAllByTenantAndDoneAfter(tenant string, doneAfter time.Time) (todos []models.Todo) {
	if err := database.DBConn.Find(&todos, "company_id = ? AND (done_at IS NULL OR done_at > ?) ORDER BY created_at desc", tenant, doneAfter).Error; err != nil {
		panic(err)
	}
	return
}

func (dao TodoDao) FindOneByIdAndTenant(id string, tenant string) (todo models.Todo) {
	if err := database.DBConn.Find(&todo, "company_id = ? AND id = ?", tenant, id).Error; err != nil {
		panic(err)
	}
	return
}

func (dao TodoDao) Update(id string, tenant string, changes dtos.TodoRequest) (todo models.Todo) {
	tx := database.DBConn.Begin()
	tx.Where("company_id = ? AND id = ?", tenant, id).First(&todo)
	if tx.Error != nil {
		panic(tx.Error)
	}
	tx.Model(&todo).Updates(models.Todo{
		Description: changes.Description,
	})
	if tx.Error != nil {
		panic(tx.Error)
	}

	tx.Commit()
	return
}

func (dao TodoDao) Create(creator models.User, newTodo dtos.TodoRequest) (todo models.Todo) {
	todo = models.Todo{
		Description: newTodo.Description,
		CompanyID:   *creator.CompanyID,
		CreatedBy:   creator.Email,
	}
	if err := database.DBConn.Create(&todo).Error; err != nil {
		log.Println("Error : ", err.Error())
		panic(err)
	}
	return
}

func (dao TodoDao) Delete(id string, creator string) {
	if err := database.DBConn.Where("id = ? and email = ?", id, creator).Delete(&models.Todo{}).Error; err != nil {
		panic(err)
	}
}

func (dao TodoDao) Done(id string, user models.User) (todo models.Todo) {
	tx := database.DBConn.Begin()
	tx.Where("company_id = ? AND id = ?", user.CompanyID, id).First(&todo)
	if tx.Error != nil {
		panic(tx.Error)
	}
	now := time.Now()
	tx.Model(&todo).Updates(models.Todo{
		DoneAt: &now,
		DoneBy: &user.Email,
	})
	if tx.Error != nil {
		panic(tx.Error)
	}

	tx.Commit()
	return
}

var DAO = &TodoDao{}
