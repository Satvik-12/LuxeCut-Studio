from pydantic import BaseModel
from typing import Optional, List
from datetime import date, time, datetime
from decimal import Decimal

# Service Schemas
class ServiceBase(BaseModel):
    name: str
    description: Optional[str] = None
    duration_minutes: int
    price: Decimal
    is_active: bool = True

class ServiceCreate(ServiceBase):
    pass

class Service(ServiceBase):
    id: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True

# Stylist Schemas
class StylistBase(BaseModel):
    name: str
    specialties: Optional[str] = None
    is_active: bool = True

class StylistCreate(StylistBase):
    pass

class Stylist(StylistBase):
    id: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True

# TimeSlot Schemas
class TimeSlotBase(BaseModel):
    stylist_id: Optional[int] = None
    date: date
    start_time: time
    end_time: time
    is_booked: bool = False

class TimeSlotCreate(TimeSlotBase):
    pass

class TimeSlot(TimeSlotBase):
    id: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True

# Appointment Schemas
class AppointmentBase(BaseModel):
    customer_name: str
    customer_phone: str
    notes: Optional[str] = None
    service_id: int
    stylist_id: Optional[int] = None
    date: date
    start_time: time

class AppointmentCreate(AppointmentBase):
    user_id: Optional[int] = None

class AppointmentUpdate(BaseModel):
    status: str

class Appointment(AppointmentBase):
    id: int
    user_id: Optional[int] = None
    status: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    service: Optional[Service]
    stylist: Optional[Stylist]

    class Config:
        orm_mode = True

# Admin Schemas
class AdminLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

from pydantic import BaseModel, EmailStr, Field, validator
import re

# ...

class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=15)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

    @validator('password')
    def validate_password(cls, v):
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one number')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v

class UserLogin(BaseModel):
    email: str
    password: str

class User(UserBase):
    id: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True
