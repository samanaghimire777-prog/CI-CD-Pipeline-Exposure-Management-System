FROM python:3.11-slim

# Install Trivy - using direct binary installation
RUN apt-get update && \
    apt-get install -y wget tar && \
    wget -qO trivy.tar.gz https://github.com/aquasecurity/trivy/releases/download/v0.48.3/trivy_0.48.3_Linux-64bit.tar.gz && \
    tar zxvf trivy.tar.gz && \
    mv trivy /usr/local/bin/ && \
    rm trivy.tar.gz && \
    chmod +x /usr/local/bin/trivy && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
