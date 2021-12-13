package appointments

import (
	"backv2/database"
	"backv2/dtos"
	"backv2/models"
	"log"
	"time"
)

type AppointmentDao struct {
}

func (dao AppointmentDao) FindAllByTenant(tenant int) (appointments []models.Appointment) {
	if err := database.DBConn.Find(&appointments, "company_id = ? ORDER BY created_at desc", tenant).Error; err != nil {
		panic(err)
	}
	return
}

func (dao AppointmentDao) FindAllByTenantAndIsDone(tenant int) (appointments []models.Appointment) {
	if err := database.DBConn.Find(&appointments, "company_id = ? AND done_at IS NOT NULL ORDER BY created_at desc", tenant).Error; err != nil {
		panic(err)
	}
	return
}

func (dao AppointmentDao) FindAllByTenantAndDoneAfter(tenant int, doneAfter time.Time) (appointments []models.Appointment) {
	if err := database.DBConn.Find(&appointments, "company_id = ? AND (done_at IS NULL OR done_at > ?) ORDER BY created_at desc", tenant, doneAfter).Error; err != nil {
		panic(err)
	}
	return
}

func (dao AppointmentDao) FindOneByIdAndTenant(id string, tenant int) (appointment models.Appointment) {
	if err := database.DBConn.Find(&appointment, "company_id = ? AND id = ?", tenant, id).Error; err != nil {
		panic(err)
	}
	return
}

func (dao AppointmentDao) Update(id string, tenant int, changes dtos.AppointmentRequest) (appointment models.Appointment) {
	tx := database.DBConn.Begin()
	tx = tx.Where("company_id = ? AND id = ?", tenant, id).First(&appointment)
	if tx.Error != nil {
		panic(tx.Error)
	}
	tx = tx.Updates(models.Appointment{
		Description: changes.Description,
	})
	if tx.Error != nil {
		panic(tx.Error)
	}

	tx.Commit()
	return
}

func (dao AppointmentDao) Create(creator models.User, newAppointment dtos.AppointmentRequest) (appointment models.Appointment) {
	appointment = models.Appointment{
		Description: newAppointment.Description,
		CompanyID:   *creator.CompanyID,
		CreatedBy:   creator.Email,
	}
	if err := database.DBConn.Create(&appointment).Error; err != nil {
		log.Println("Error : ", err.Error())
		panic(err)
	}
	return
}

func (dao AppointmentDao) Delete(id string, creator string) {
	if err := database.DBConn.Where("id = ? and email = ?", id, creator).Delete(&models.Appointment{}).Error; err != nil {
		panic(err)
	}
}

func (dao AppointmentDao) Done(id string, user models.User) (appointment models.Appointment) {
	tx := database.DBConn.Begin()
	tx = tx.Where("company_id = ? AND id = ?", user.CompanyID, id).First(&appointment)
	if tx.Error != nil {
		panic(tx.Error)
	}
	now := time.Now()
	tx = tx.Updates(models.Appointment{
		DoneAt: &now,
		DoneBy: &user.Email,
	})
	if tx.Error != nil {
		panic(tx.Error)
	}

	tx.Commit()
	return
}

var DAO = &AppointmentDao{}
