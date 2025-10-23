from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
import pathlib, os, uvicorn

app = FastAPI(title="ANK Studio Backend")

# ================== CONFIG ==================
SECRET_TOKEN = os.getenv("ADMIN_SECRET", "anka12341")

# ✅ база поки що не використовується, але готуємо /data (Railway-friendly)
DATA_DIR = pathlib.Path("/data")
DATA_DIR.mkdir(exist_ok=True)

# ================== CORS ==================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # у продакшні краще ["https://ankstudio.online"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# 🩷 МОДУЛЬ: Банер (адмін редагує, користувачі бачать)
# ============================================================

class Banner(BaseModel):
    title: str
    image_url: str | None = None
    active: bool = True

# Початковий банер (тимчасово в пам’яті)
current_banner = Banner(
    title="Знижка 50% до 10 листопада 🎀",
    image_url="https://i.imgur.com/yourbanner.png",
    active=True,
)

@app.get("/api/banner")
async def get_banner():
    """Отримати активний банер (для користувачів)"""
    if not current_banner.active:
        return {"active": False}
    return current_banner

@app.post("/api/banner")
async def update_banner(request: Request):
    """Оновити банер (для адміна)"""
    data = await request.json()
    token = data.get("token")

    if token != SECRET_TOKEN:
        raise HTTPException(status_code=403, detail="Access denied")

    global current_banner
    current_banner = Banner(**data["banner"])
    return {"success": True, "banner": current_banner}


# ============================================================
# 🩷 МОДУЛЬ: Тимчасові акаунти (створює адмін)
# ============================================================

class User(BaseModel):
    id: int
    email: str
    password: str
    expires_at: datetime
    active: bool = True

users_db: list[User] = []
user_counter = 1

@app.post("/api/users/create")
async def create_user(request: Request):
    """Створити тимчасовий акаунт"""
    data = await request.json()
    token = data.get("token")

    if token != SECRET_TOKEN:
        raise HTTPException(status_code=403, detail="Access denied")

    global user_counter
    email = data["email"]
    password = data.get("password", f"user{user_counter:04d}")
    days = data.get("days", 7)

    expires_at = datetime.utcnow() + timedelta(days=days)
    new_user = User(
        id=user_counter,
        email=email,
        password=password,
        expires_at=expires_at,
    )
    users_db.append(new_user)
    user_counter += 1

    return {"success": True, "user": new_user}


@app.get("/api/users")
async def get_users():
    """Отримати всіх активних користувачів"""
    active_users = [u for u in users_db if u.active]
    return {"users": active_users}


# ============================================================
# 🩷 HEALTHCHECK / ROOT
# ============================================================

@app.get("/")
def root():
    return {"status": "ok", "msg": "ANK Studio LMS backend is running 💅"}


# ============================================================
# 🩷 MAIN ENTRY (для Railway)
# ============================================================
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=False)
