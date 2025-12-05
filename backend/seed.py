from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, crud, schemas
from decimal import Decimal

def seed_data():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if data exists
    if db.query(models.AdminUser).first():
        print("Data already seeded.")
        return

    # Create Admin
    admin_data = schemas.AdminLogin(email="admin@luxecut.com", password="Admin123!")
    crud.create_admin_user(db, admin_data)
    print("Admin created.")

    # Create Services
    services = [
        schemas.ServiceCreate(name="Haircut - Men", description="Standard men's haircut", duration_minutes=30, price=Decimal("500.00")),
        schemas.ServiceCreate(name="Haircut - Women", description="Standard women's haircut", duration_minutes=60, price=Decimal("1200.00")),
        schemas.ServiceCreate(name="Facial", description="Rejuvenating facial", duration_minutes=45, price=Decimal("1500.00")),
        schemas.ServiceCreate(name="Hair Spa", description="Deep conditioning", duration_minutes=60, price=Decimal("2000.00")),
    ]
    
    for s in services:
        crud.create_service(db, s)
    print("Services created.")

    # Create Stylists
    stylists = [
        schemas.StylistCreate(name="Alice", specialties="Haircuts, Coloring"),
        schemas.StylistCreate(name="Bob", specialties="Men's Cuts, Beard"),
        schemas.StylistCreate(name="Charlie", specialties="Facials, Spa"),
    ]
    
    for s in stylists:
        crud.create_stylist(db, s)
    print("Stylists created.")
    
    db.close()

if __name__ == "__main__":
    seed_data()
