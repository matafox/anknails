# --- Dockerfile ---
FROM python:3.11-slim

# створюємо робочу директорію
WORKDIR /app

# копіюємо бекенд
COPY backend /app/backend

# встановлюємо залежності
RUN pip install --no-cache-dir -r backend/requirements.txt

# запускаємо бекенд
CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "8080"]
