from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from sqlalchemy import create_engine, Column, Integer, String, DateTime, func, distinct
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime
import requests, os

app = FastAPI(title="ANK Analytics")

# Config
SECRET_PATH = os.getenv("ADMIN_SECRET", "anksecret2025")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./visits.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class Visit(Base):
    __tablename__ = "visits"
    id = Column(Integer, primary_key=True)
    ip = Column(String)
    country = Column(String)
    path = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

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

@app.middleware("http")
async def track(request: Request, call_next):
    response = await call_next(request)
    if request.method == "GET" and not request.url.path.endswith(SECRET_PATH):
        db = SessionLocal()
        ip = get_ip(request)
        country = get_country(ip)
        db.add(Visit(ip=ip, country=country, path=request.url.path))
        db.commit()
        db.close()
    return response

@app.get(f"/{SECRET_PATH}", response_class=HTMLResponse)
def admin():
    db = SessionLocal()
    total = db.query(func.count(Visit.id)).scalar()
    unique_ips = db.query(func.count(distinct(Visit.ip))).scalar()
    by_country = db.query(Visit.country, func.count(Visit.id)).group_by(Visit.country).all()
    last = db.query(Visit).order_by(Visit.created_at.desc()).limit(50).all()
    db.close()

    html = f"""
    <html><head><meta charset='utf-8'>
    <title>ANK Analytics</title>
    <style>
      body{{font-family:sans-serif;background:#fff0f7;padding:40px;max-width:900px;margin:auto;}}
      h1{{color:#d63384;}} table{{width:100%;border-collapse:collapse;}}
      td,th{{border-bottom:1px solid #eee;padding:6px 10px;text-align:left;}}
      tr:hover{{background:#fff8fc;}}
    </style></head><body>
    <h1>🌸 ANK Analytics</h1>
    <b>Всього відвідувань:</b> {total or 0} <br/>
    <b>Унікальних IP:</b> {unique_ips or 0}<br/><br/>
    <h3>📍 Країни</h3>
    <table>{"".join(f"<tr><td>{c}</td><td>{n}</td></tr>" for c,n in by_country)}</table>
    <h3>🕓 Останні 50</h3>
    <table>{"".join(f"<tr><td>{v.ip}</td><td>{v.country}</td><td>{v.path}</td><td>{v.created_at.strftime('%H:%M %d.%m')}</td></tr>" for v in last)}</table>
    </body></html>"""
    return HTMLResponse(html)

# 🩷 додаємо головну сторінку, щоб не було "Not Found"
@app.get("/")
def home():
    return {"status": "ok", "msg": "ANK backend is running"}
