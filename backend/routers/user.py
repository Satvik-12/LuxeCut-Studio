from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import database, schemas, crud, auth, models

router = APIRouter(prefix="/api/user", tags=["User"])

@router.get("/appointments", response_model=List[schemas.Appointment])
def read_user_appointments(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    return crud.get_user_appointments(db, user_id=current_user.id)
