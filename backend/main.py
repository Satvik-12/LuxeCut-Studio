from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import public, admin, auth, user

app = FastAPI(title="LuxeCut Studio API")

# CORS
origins = [
    "http://localhost:4200", # Angular
    "http://localhost:5173", # Vite (just in case)
    "http://localhost:3000",
    "https://luxecut-studio.netlify.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(public.router)
app.include_router(admin.router)
app.include_router(auth.router)
app.include_router(user.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to LuxeCut Studio API"}
