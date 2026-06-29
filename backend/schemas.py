from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import date, time, datetime
from decimal import Decimal
import re

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

# User Schemas
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

# Analytics Schemas
class SiteVisitCreate(BaseModel):
    session_id: str
    page_path: str
    referrer: Optional[str] = None
    screen_width: Optional[int] = None
    screen_height: Optional[int] = None

class SiteVisitResponse(BaseModel):
    id: int
    session_id: str
    page_path: str
    referrer: Optional[str]
    country: Optional[str]
    city: Optional[str]
    device_type: Optional[str]
    browser: Optional[str]
    os: Optional[str]
    screen_width: Optional[int]
    screen_height: Optional[int]
    visited_at: Optional[datetime]

    class Config:
        orm_mode = True

class PageStat(BaseModel):
    page_path: str
    visit_count: int

class LocationStat(BaseModel):
    location: str
    visit_count: int

class DeviceStat(BaseModel):
    device_type: str
    visit_count: int

class BrowserStat(BaseModel):
    browser: str
    visit_count: int

class HourlyStat(BaseModel):
    hour: int
    visit_count: int

class AnalyticsOverview(BaseModel):
    total_visits: int
    visits_today: int
    visits_this_week: int
    visits_this_month: int
    unique_visitors: int
    top_pages: List[PageStat]
    top_countries: List[LocationStat]
    top_cities: List[LocationStat]
    device_breakdown: List[DeviceStat]
    browser_breakdown: List[BrowserStat]
    hourly_breakdown: List[HourlyStat]
    recent_visits: List[SiteVisitResponse]
