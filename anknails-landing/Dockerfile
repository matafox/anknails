# --- Dockerfile ---
FROM python:3.11-slim

WORKDIR /app

# копіюємо бекенд
COPY backend /app/backend

# встановлюємо залежності
RUN pip install --no-cache-dir -r backend/requirements.txt

# Railway використовує змінну PORT — передає її контейнеру автоматично
ENV PORT=8080

# відкриваємо порт
EXPOSE 8080

# запускаємо сервер FastAPI
CMD ["sh", "-c", "uvicorn backend.app:app --host 0.0.0.0 --port $PORT"]
