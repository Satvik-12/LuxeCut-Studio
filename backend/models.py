from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date, Time, Text, Numeric, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    duration_minutes = Column(Integer, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    appointments = relationship("Appointment", back_populates="service")

class Stylist(Base):
    __tablename__ = "stylists"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    specialties = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    appointments = relationship("Appointment", back_populates="stylist")
    time_slots = relationship("TimeSlot", back_populates="stylist")

class TimeSlot(Base):
    __tablename__ = "time_slots"

    id = Column(Integer, primary_key=True, index=True)
    stylist_id = Column(Integer, ForeignKey("stylists.id"), nullable=True)
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    is_booked = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    stylist = relationship("Stylist", back_populates="time_slots")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    appointments = relationship("Appointment", back_populates="user")

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    customer_name = Column(String(100), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    notes = Column(Text, nullable=True)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    stylist_id = Column(Integer, ForeignKey("stylists.id"), nullable=True)
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    status = Column(String(20), default="PENDING") # PENDING, CONFIRMED, CANCELLED, COMPLETED
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="appointments")
    service = relationship("Service", back_populates="appointments")
    stylist = relationship("Stylist", back_populates="appointments")

class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SiteVisit(Base):
    __tablename__ = "site_visits"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), index=True)
    page_path = Column(String(500))
    referrer = Column(String(1000), nullable=True)
    user_agent = Column(Text, nullable=True)
    ip_address = Column(String(45), nullable=True)
    country = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    device_type = Column(String(20), nullable=True)
    browser = Column(String(50), nullable=True)
    os = Column(String(50), nullable=True)
    screen_width = Column(Integer, nullable=True)
    screen_height = Column(Integer, nullable=True)
    visited_at = Column(DateTime(timezone=True), server_default=func.now())
