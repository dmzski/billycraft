package appointments

import (
	"backv2/database"
	"backv2/internal/lib/models"
	"log"
	"time"
)

type Repository struct {
}

func (dao Repository) FindAllByTenant(tenant int) (appointments []Appointment) {
	if err := database.DBConn.Preload("Assignees").Find(&appointments, "company_id = ? ORDER BY created_at desc", tenant).Error; err != nil {
		panic(err)
	}
	return
}

func (dao Repository) FindAllByTenantStartDateBetween(tenant int, startDate time.Time, endDate time.Time) (appointments []Appointment) {
	if err := database.DBConn.Preload("Assignees").Find(&appointments, "company_id = ? AND start_date BETWEEN ? AND ? ORDER BY start_date asc", tenant, startDate, endDate).Error; err != nil {
		panic(err)
	}
	return
}

func (dao Repository) FindAllByTenantStartDateGreaterThan(tenant int, startDate time.Time) (appointments []Appointment) {
	if err := database.DBConn.Preload("Assignees").Find(&appointments, "company_id = ? AND start_date > ? ORDER BY start_date asc", tenant, startDate).Error; err != nil {
		panic(err)
	}
	return
}

func (dao Repository) FindAllByTenantAndIsDone(tenant int) (appointments []Appointment) {
	if err := database.DBConn.Preload("Assignees").Find(&appointments, "company_id = ? AND done_at IS NOT NULL ORDER BY created_at desc", tenant).Error; err != nil {
		panic(err)
	}
	return
}

func (dao Repository) FindAllByTenantAndDoneAfter(tenant int, doneAfter time.Time) (appointments []Appointment) {
	if err := database.DBConn.Preload("Assignees").Find(&appointments, "company_id = ? AND (done_at IS NULL OR done_at > ?) ORDER BY created_at desc", tenant, doneAfter).Error; err != nil {
		panic(err)
	}
	return
}

func (dao Repository) FindOneByIdAndTenant(id string, tenant int) (appointment Appointment) {
	if err := database.DBConn.Preload("Assignees").Find(&appointment, "company_id = ? AND id = ?", tenant, id).Error; err != nil {
		panic(err)
	}
	return
}

func (dao Repository) Update(id string, tenant int, changes AppointmentRequest) (appointment Appointment) {
	tx := database.DBConn.Begin()
	tx.Where("company_id = ? AND id = ?", tenant, id).First(&appointment)
	if tx.Error != nil {
		panic(tx.Error)
	}
	newValues := Appointment{}.FromDTO(changes)

	tx.Model(&appointment).Updates(newValues)
	if tx.Error != nil {
		tx.Rollback()
		panic(tx.Error)
	}

	// Delete assignees and add the new ones (Set)
	if changes.Assignees != nil {

		var assignees []AppointmentAssignee
		for _, x := range changes.Assignees {
			assignees = append(assignees, AppointmentAssignee{
				AppointmentID: appointment.ID,
				Assignee:      x,
			})
		}

		tx.Where("appointment_id = ?", appointment.ID).Delete(AppointmentAssignee{})
		if tx.Error != nil {
			err := tx.Error
			tx.Rollback()
			panic(err)
		}
		err := tx.Model(&appointment).Association("Assignees").Append(assignees)
		if err != nil {
			tx.Rollback()
			panic(err)
		}
	}

	tx.Commit()
	return
}

func (dao Repository) Create(creator models.User, dto AppointmentRequest) (appointment Appointment) {
	appointment = appointment.FromDTO(dto)
	appointment.CompanyID = *creator.CompanyID
	appointment.CreatedBy = creator.Email
	if err := database.DBConn.Create(&appointment).Error; err != nil {
		log.Println("Error : ", err.Error())
		panic(err)
	}
	return
}

func (dao Repository) Delete(id string, creator string) {
	if err := database.DBConn.Where("id = ? and created_by = ?", id, creator).Delete(&Appointment{}).Error; err != nil {
		panic(err)
	}
}

func (dao Repository) Done(id string, user models.User) (appointment Appointment) {
	tx := database.DBConn.Begin()
	tx = tx.Where("company_id = ? AND id = ?", user.CompanyID, id).First(&appointment)
	if tx.Error != nil {
		panic(tx.Error)
	}
	now := time.Now()
	tx = tx.Updates(Appointment{
		DoneAt: &now,
		DoneBy: &user.Email,
	})
	if tx.Error != nil {
		panic(tx.Error)
	}

	tx.Commit()
	return
}

var DAO = &Repository{}
