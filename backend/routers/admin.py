from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import timedelta, date
import database, schemas, crud, auth, models
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.post("/login", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = crud.get_admin_by_email(db, email=form_data.username)
    if not user or not crud.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/dashboard")
def get_dashboard_stats(current_user: models.AdminUser = Depends(auth.get_current_admin), db: Session = Depends(database.get_db)):
    today = date.today()
    appointments_today = db.query(models.Appointment).filter(models.Appointment.date == today).count()
    pending_appointments = db.query(models.Appointment).filter(models.Appointment.status == "PENDING").count()
    
    return {
        "appointments_today": appointments_today,
        "pending_appointments": pending_appointments
    }

@router.get("/appointments", response_model=List[schemas.Appointment])
def read_appointments(
    date_filter: Optional[date] = None, 
    status_filter: Optional[str] = None,
    skip: int = 0, 
    limit: int = 100, 
    current_user: models.AdminUser = Depends(auth.get_current_admin), 
    db: Session = Depends(database.get_db)
):
    query = db.query(models.Appointment)
    if date_filter:
        query = query.filter(models.Appointment.date == date_filter)
    if status_filter and status_filter != "ALL":
        query = query.filter(models.Appointment.status == status_filter)
        
    return query.offset(skip).limit(limit).all()

@router.patch("/appointments/{appointment_id}", response_model=schemas.Appointment)
def update_appointment_status(
    appointment_id: int, 
    status_update: schemas.AppointmentUpdate,
    current_user: models.AdminUser = Depends(auth.get_current_admin), 
    db: Session = Depends(database.get_db)
):
    return crud.update_appointment_status(db, appointment_id, status_update.status)

@router.post("/services", response_model=schemas.Service)
def create_service(
    service: schemas.ServiceCreate,
    current_user: models.AdminUser = Depends(auth.get_current_admin),
    db: Session = Depends(database.get_db)
):
    return crud.create_service(db, service)

@router.post("/stylists", response_model=schemas.Stylist)
def create_stylist(
    stylist: schemas.StylistCreate,
    current_user: models.AdminUser = Depends(auth.get_current_admin),
    db: Session = Depends(database.get_db)
):
    return crud.create_stylist(db, stylist)
