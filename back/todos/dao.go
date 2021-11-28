package todos

import (
	"backv2/database"
	"backv2/dtos"
	"backv2/models"
	"log"
	"time"
)

type TodoDao struct {
}

func (dao TodoDao) FindAllByTenant(tenant int) (todos []models.Todo) {
	if err := database.DBConn.Find(&todos, "company_id = ?", tenant).Error; err != nil {
		panic(err)
	}
	return
}

func (dao TodoDao) FindOneByIdAndTenant(id string, tenant int) (todo models.Todo) {
	if err := database.DBConn.Find(&todo, "company_id = ? AND id = ?", tenant, id).Error; err != nil {
		panic(err)
	}
	return
}

func (dao TodoDao) Update(id string, tenant int, changes dtos.TodoRequest) (todo models.Todo) {
	tx := database.DBConn.Begin().Where("company_id = ? AND id = ?", tenant, id).First(&todo)
	if tx.Error != nil {
		panic(tx.Error)
	}
	tx = tx.Updates(models.Todo{
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
	tx := database.DBConn.Begin().Where("company_id = ? AND id = ?", user.CompanyID, id).First(&todo)
	if tx.Error != nil {
		panic(tx.Error)
	}
	now := time.Now()
	tx = tx.Updates(models.Todo{
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
