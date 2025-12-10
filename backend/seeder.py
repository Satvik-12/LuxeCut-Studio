from sqlalchemy.orm import Session
import models
from database import SessionLocal

def seed_users(db: Session):
    if not db.query(models.AdminUser).filter_by(email="admin@luxecut.com").first():
        admin = models.AdminUser(
            email="admin@luxecut.com",
            # Password: Admin123!
            password_hash="$2b$12$KJjJRhhtu7f4uQ4zJ9BmCufJXAaLNzIW357T8HOyEeKApi2Igpyqu"
        )
        db.add(admin)
        print("Seeded Admin User")
    else:
        print("Admin user already exists")
    
    db.commit()

def seed_services(db: Session):
    services_data = [
        {"name": "Haircut - Men", "description": "Standard men's haircut", "duration_minutes": 30, "price": 500.00},
        {"name": "Haircut - Women", "description": "Standard women's haircut", "duration_minutes": 60, "price": 1200.00},
        {"name": "Facial", "description": "Rejuvenating facial", "duration_minutes": 45, "price": 1500.00},
        {"name": "Hair Spa", "description": "Deep conditioning", "duration_minutes": 60, "price": 2000.00},
    ]

    for data in services_data:
        if not db.query(models.Service).filter_by(name=data["name"]).first():
            service = models.Service(**data)
            db.add(service)
            print(f"Seeded Service: {data['name']}")
        else:
            print(f"Service already exists: {data['name']}")
    
    db.commit()

def seed_stylists(db: Session):
    stylists_data = [
        {"name": "Alice", "specialties": "Haircuts, Coloring"},
        {"name": "Bob", "specialties": "Men's Cuts, Beard"},
        {"name": "Charlie", "specialties": "Facials, Spa"},
    ]

    for data in stylists_data:
        if not db.query(models.Stylist).filter_by(name=data["name"]).first():
            stylist = models.Stylist(**data)
            db.add(stylist)
            print(f"Seeded Stylist: {data['name']}")
        else:
            print(f"Stylist already exists: {data['name']}")
    
    db.commit()

def seed_all():
    db = SessionLocal()
    try:
        seed_users(db)
        seed_services(db)
        seed_stylists(db)
        print("Database seeding completed.")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()
