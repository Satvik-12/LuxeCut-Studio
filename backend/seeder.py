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
    
    db.commit()

def seed_services(db: Session):
    if db.query(models.Service).first():
        return

    services = [
        models.Service(name="Haircut - Men", description="Standard men's haircut", duration_minutes=30, price=500.00),
        models.Service(name="Haircut - Women", description="Standard women's haircut", duration_minutes=60, price=1200.00),
        models.Service(name="Facial", description="Rejuvenating facial", duration_minutes=45, price=1500.00),
        models.Service(name="Hair Spa", description="Deep conditioning", duration_minutes=60, price=2000.00),
    ]
    
    db.add_all(services)
    db.commit()
    print("Seeded Services")

def seed_stylists(db: Session):
    if db.query(models.Stylist).first():
        return

    stylists = [
        models.Stylist(name="Alice", specialties="Haircuts, Coloring"),
        models.Stylist(name="Bob", specialties="Men's Cuts, Beard"),
        models.Stylist(name="Charlie", specialties="Facials, Spa"),
    ]
    
    db.add_all(stylists)
    db.commit()
    print("Seeded Stylists")

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
