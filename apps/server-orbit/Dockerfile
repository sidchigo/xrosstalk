# ---- Build Stage ----
FROM python:3.12-slim AS builder

WORKDIR /code

# Install pipenv and system dependencies
RUN pip install --no-cache-dir pipenv

# Copy only dependency files first for better caching
COPY Pipfile .
COPY Pipfile.lock .

# Install dependencies into a virtual environment
RUN pipenv install --deploy --clear --system

# Copy app source code
COPY app ./app

# --- Development image ---
FROM python:3.12-slim AS development

WORKDIR /usr/local/orbit-app

# Install pipenv and system dependencies
RUN pip install --no-cache-dir pipenv

# Copy only dependency files first for better caching
COPY Pipfile .
COPY Pipfile.lock .

# Install dependencies into a virtual environment
RUN pipenv install --deploy --clear --system

# Copy app source code
COPY app ./app

ENV PORT=5001
EXPOSE 5001

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5001", "--reload"]

# --- Final image ---
FROM python:3.12-slim AS production

WORKDIR /code

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.12 /usr/local/lib/python3.12
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --from=builder /code/app ./app

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Start FastAPI app via Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5001"]