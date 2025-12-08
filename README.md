# LuxeCut Studio - Salon Booking System

LuxeCut Studio is a modern, full-stack web application for salon booking management. It features a public-facing booking portal for customers and a secure admin dashboard for salon staff.

## Features

### Public Portal

- **Service Browsing**: View available salon services with prices and durations.
- **Real-time Availability**: Check stylist availability for specific dates.
- **Booking Flow**: Seamless 3-step booking process (Service -> Date/Time -> Details).
- **Responsive Design**: Optimized for mobile and desktop.

### Admin Dashboard

- **Appointment Management**: View, confirm, complete, or cancel appointments.
- **Service Management**: Add, edit, or deactivate services.
- **Stylist Management**: Manage stylist profiles.
- **Dashboard Stats**: Quick overview of daily appointments and pending requests.
- **Secure Auth**: JWT-based authentication for admin access.

## Tech Stack

- **Backend**: Python, FastAPI, SQLAlchemy, MySQL
- **Frontend**: Angular 19, SCSS, TypeScript
- **Database**: MySQL

## Setup & Running

### Prerequisites

- Python 3.8+
- Node.js 18+
- npm

### 1. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create and activate virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

**Database Setup**:
Ensure you have MySQL installed and running.
Create the database and seed data:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS luxecut;"
mysql -u root -p -D luxecut < schema.sql
mysql -u root -p -D luxecut < seed.sql
```

Run the server (Set DATABASE_URL env var):

```bash
# Example for local MySQL
export DATABASE_URL="mysql+pymysql://root:password@localhost/luxecut"
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.
API Documentation: `http://localhost:8000/docs`.

### 2. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
ng serve
```

The application will be available at `http://localhost:4200`.

## Default Credentials

**Admin Login**:

- Email: `admin@luxecut.com`
- Password: `Admin123!`
