# 🐍 Python base image
FROM python:3.11-slim

# 📂 Workdir
WORKDIR /app

# 🔧 Copy dependencies
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# 📦 Copy backend code
COPY backend ./backend

# 🌍 Railway sets PORT automatically
ENV PORT=${PORT:-8000}
EXPOSE $PORT

# 🚀 Start FastAPI with dynamic port
CMD ["sh", "-c", "python -m uvicorn backend.app:app --host 0.0.0.0 --port $PORT"]
