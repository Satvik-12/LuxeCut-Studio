from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import database, schemas, crud, models
from datetime import date, datetime

router = APIRouter(prefix="/api", tags=["Public"])

@router.get("/services", response_model=List[schemas.Service])
def read_services(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    services = crud.get_services(db, skip=skip, limit=limit)
    return services

@router.get("/stylists", response_model=List[schemas.Stylist])
def read_stylists(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    stylists = crud.get_stylists(db, skip=skip, limit=limit)
    return stylists

@router.get("/availability")
def check_availability(date: date, service_id: int, stylist_id: int = None, db: Session = Depends(database.get_db)):
    # Mock availability logic:
    # 1. Generate slots from 10:00 to 18:00
    # 2. Filter out booked slots
    
    start_hour = 10
    end_hour = 18
    slots = []
    
    # Simple hourly slots for demo
    for hour in range(start_hour, end_hour):
        time_str = f"{hour:02d}:00:00"
        start_time = datetime.strptime(time_str, "%H:%M:%S").time()
        
        # Check if slot is available
        # If stylist is provided, check that specific stylist
        # If no stylist, check if ANY stylist is available (simplified: just check if generic slot is free)
        
        # For this demo, we'll assume if stylist_id is provided we check them.
        # If not, we just show slots as available unless fully booked (logic omitted for simplicity, assuming single stylist flow or user picks stylist)
        
        is_free = True
        if stylist_id:
            is_free = crud.is_slot_available(db, stylist_id, date, start_time)
        
        if is_free:
            slots.append(time_str)
            
    return {"date": date, "available_slots": slots}

@router.post("/appointments", response_model=schemas.Appointment)
def create_appointment(appointment: schemas.AppointmentCreate, db: Session = Depends(database.get_db)):
    # Validate service exists
    service = db.query(models.Service).filter(models.Service.id == appointment.service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
        
    # Check availability if stylist selected
    if appointment.stylist_id:
        if not crud.is_slot_available(db, appointment.stylist_id, appointment.date, appointment.start_time):
             raise HTTPException(status_code=400, detail="Slot already booked")
             
    return crud.create_appointment(db=db, appointment=appointment)

@router.get("/appointments/{appointment_id}", response_model=schemas.Appointment)
def read_appointment(appointment_id: int, db: Session = Depends(database.get_db)):
    db_appointment = crud.get_appointment(db, appointment_id=appointment_id)
    if db_appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return db_appointment
