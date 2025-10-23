# 🐍 Офіційний Python образ
FROM python:3.11-slim

# 📂 Робоча директорія
WORKDIR /app

# 🔧 Скопіюємо залежності
COPY backend/requirements.txt ./requirements.txt

# 📦 Встановимо залежності
RUN pip install --no-cache-dir -r requirements.txt

# 📂 Скопіюємо код бекенду
COPY backend ./backend

# 🌍 Змінна середовища для Railway
ENV PORT=8000
EXPOSE 8000

# 🚀 Запускаємо uvicorn
CMD ["python", "-m", "uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "8000"]
