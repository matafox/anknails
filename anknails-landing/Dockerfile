FROM python:3.11-slim

WORKDIR /app

COPY backend /app/backend

RUN pip install --no-cache-dir -r backend/requirements.txt

ENV PORT=8080
EXPOSE 8080

# 🔥 Використовуємо uvicorn напряму — гарантовано працює на Railway
CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "8080"]
