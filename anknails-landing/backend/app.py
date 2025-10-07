from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy import create_engine, Column, Integer, String, DateTime, func, distinct
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime, timedelta
import requests, os, pathlib
from collections import defaultdict

app = FastAPI(title="ANK Analytics")

# ================== CONFIG ==================
SECRET_PATH = os.getenv("ADMIN_SECRET", "anksecret2025")

# ✅ зберігаємо базу в /data (Railway не чистить цю теку)
DATA_DIR = pathlib.Path("/data")
DATA_DIR.mkdir(exist_ok=True)
DATABASE_URL = f"sqlite:///{DATA_DIR}/visits.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# ================== MODEL ==================
class Visit(Base):
    __tablename__ = "visits"
    id = Column(Integer, primary_key=True)
    ip = Column(String)
    country = Column(String)
    path = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# ================== HELPERS ==================
def get_ip(request: Request):
    xff = request.headers.get("x-forwarded-for")
    return xff.split(",")[0].strip() if xff else request.client.host

def get_country(ip):
    try:
        if ip.startswith("127.") or ip == "::1":
            return "local"
        res = requests.get(f"http://ip-api.com/json/{ip}?fields=country", timeout=2)
        return res.json().get("country", "unknown")
    except:
        return "unknown"

IGNORED_EXTENSIONS = (
    ".ico", ".png", ".jpg", ".jpeg", ".svg", ".gif",
    ".webp", ".css", ".js", ".json", ".txt", ".map",
    ".woff", ".woff2", ".ttf"
)

def is_static_request(path: str) -> bool:
    return any(path.lower().endswith(ext) for ext in IGNORED_EXTENSIONS)

# ================== MIDDLEWARE ==================
@app.middleware("http")
async def track(request: Request, call_next):
    response = await call_next(request)
    path = request.url.path

    if (
        request.method == "GET"
        and not path.endswith(SECRET_PATH)
        and not is_static_request(path)
        and path != "/ping"
    ):
        db = SessionLocal()
        ip = get_ip(request)
        now = datetime.utcnow()

        # не дублюємо протягом 15 хв
        recent = db.query(Visit).filter(
            Visit.ip == ip,
            Visit.created_at > now - timedelta(minutes=15)
        ).first()

        if not recent:
            country = get_country(ip)
            db.add(Visit(ip=ip, country=country, path=path))
            db.commit()
        db.close()

    return response

# ================== /PING (для фронтенду) ==================
@app.get("/ping")
def ping(request: Request):
    db = SessionLocal()
    ip = get_ip(request)
    now = datetime.utcnow()

    # записуємо лише якщо не було за останні 15 хв
    recent = db.query(Visit).filter(
        Visit.ip == ip,
        Visit.created_at > now - timedelta(minutes=15)
    ).first()

    if not recent:
        country = get_country(ip)
        db.add(Visit(ip=ip, country=country, path="/site"))
        db.commit()
    db.close()
    return JSONResponse({"ok": True, "ip": ip})

# ================== ADMIN PANEL ==================
@app.get(f"/{SECRET_PATH}", response_class=HTMLResponse)
def admin():
    db = SessionLocal()
    total = db.query(func.count(Visit.id)).scalar() or 0
    unique_ips = db.query(func.count(distinct(Visit.ip))).scalar() or 0

    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_visits = db.query(func.count(Visit.id)).filter(Visit.created_at >= today_start).scalar() or 0

    by_country = db.query(Visit.country, func.count(Visit.id)).group_by(Visit.country).all()
    visits = db.query(Visit).order_by(Visit.created_at.desc()).all()

    # групування по днях
    grouped = defaultdict(list)
    for v in visits:
        day = v.created_at.strftime("%d.%m.%Y")
        grouped[day].append(v)
    db.close()

    html = f"""
    <html><head><meta charset='utf-8'>
    <title>ANK Analytics</title>
    <style>
      body {{font-family:sans-serif;background:#fff0f7;padding:40px;max-width:1000px;margin:auto;}}
      h1 {{color:#d63384;}}
      h3 {{color:#d63384;margin-top:40px;}}
      table {{width:100%;border-collapse:collapse;margin-top:10px;}}
      td,th {{border-bottom:1px solid #eee;padding:6px 10px;text-align:left;}}
      tr:hover {{background:#fff8fc;}}
      .day-block {{background:#ffeaf5;padding:10px 16px;border-radius:12px;margin-top:30px;}}
    </style></head><body>
    <h1>🌸 ANK Analytics</h1>
    <b>Всього відвідувань:</b> {total}<br/>
    <b>Унікальних IP:</b> {unique_ips}<br/>
    <b>Сьогоднішніх:</b> {today_visits}<br/><br/>
    <h3>📍 Країни</h3>
    <table>
      {''.join(f"<tr><td>{c}</td><td>{n}</td></tr>" for c,n in by_country)}
    </table>
    """

    for day, records in grouped.items():
        html += f"<div class='day-block'><h3>📅 {day} — {len(records)} візитів</h3>"
        html += "<table><tr><th>IP</th><th>Країна</th><th>Шлях</th><th>Час</th></tr>"
        for v in records:
            time_str = v.created_at.strftime("%H:%M:%S")
            html += f"<tr><td>{v.ip}</td><td>{v.country}</td><td>{v.path}</td><td>{time_str}</td></tr>"
        html += "</table></div>"

    html += "</body></html>"
    return HTMLResponse(html)

# ================== ROOT ==================
@app.get("/")
def home():
    return {"status": "ok", "msg": "ANK backend running"}
