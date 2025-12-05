from sqlalchemy.orm import Session
from sqlalchemy import and_
import models, schemas
import bcrypt
from datetime import date

def get_password_hash(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# Services
def get_services(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Service).filter(models.Service.is_active == True).offset(skip).limit(limit).all()

def get_all_services_admin(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Service).offset(skip).limit(limit).all()

def create_service(db: Session, service: schemas.ServiceCreate):
    db_service = models.Service(**service.dict())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

def update_service(db: Session, service_id: int, service: schemas.ServiceCreate):
    db_service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if db_service:
        for key, value in service.dict().items():
            setattr(db_service, key, value)
        db.commit()
        db.refresh(db_service)
    return db_service

# Stylists
def get_stylists(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Stylist).filter(models.Stylist.is_active == True).offset(skip).limit(limit).all()

def create_stylist(db: Session, stylist: schemas.StylistCreate):
    db_stylist = models.Stylist(**stylist.dict())
    db.add(db_stylist)
    db.commit()
    db.refresh(db_stylist)
    return db_stylist

# Appointments
def create_appointment(db: Session, appointment: schemas.AppointmentCreate):
    db_appointment = models.Appointment(**appointment.dict(), status="PENDING")
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

def get_appointment(db: Session, appointment_id: int):
    return db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()

def get_appointments_by_date(db: Session, date_filter: date):
    return db.query(models.Appointment).filter(models.Appointment.date == date_filter).all()

def get_all_appointments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Appointment).offset(skip).limit(limit).all()

def update_appointment_status(db: Session, appointment_id: int, status: str):
    db_appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if db_appointment:
        db_appointment.status = status
        db.commit()
        db.refresh(db_appointment)
    return db_appointment

# Admin
def get_admin_by_email(db: Session, email: str):
    return db.query(models.AdminUser).filter(models.AdminUser.email == email).first()

def create_admin_user(db: Session, admin: schemas.AdminLogin):
    hashed_password = get_password_hash(admin.password)
    db_admin = models.AdminUser(email=admin.email, password_hash=hashed_password)
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin

# Availability (Simple logic: check if time slot is booked in appointments or time_slots)
# For this demo, we will check existing appointments for the stylist/date
def is_slot_available(db: Session, stylist_id: int, date_obj: date, start_time):
    # Check appointments
    appointment = db.query(models.Appointment).filter(
        models.Appointment.stylist_id == stylist_id,
        models.Appointment.date == date_obj,
        models.Appointment.start_time == start_time,
        models.Appointment.status != "CANCELLED"
    ).first()
    
    if appointment:
        return False
        
    return True
