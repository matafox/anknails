# --- Dockerfile ---
FROM python:3.11-slim

WORKDIR /app

# копіюємо весь бекенд
COPY backend backend

# встановлюємо залежності
RUN pip install --no-cache-dir -r backend/requirements.txt

# Railway використовує змінну PORT — передає її контейнеру автоматично
ENV PORT=8080

# відкриваємо порт
EXPOSE 8080

# запускаємо сервер FastAPI
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080", "--app-dir", "backend"]
