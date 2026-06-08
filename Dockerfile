# Use a lightweight Python base image
FROM python:3.11-slim

# Set working directory inside the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    procps \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies for Ralph
# We'll copy requirements if they exist, or install common ones
RUN pip install --no-cache-dir discord.py asyncio aiohttp

# Create a non-root user for security
RUN useradd -m ralph
USER ralph

# Command to run Ralph
# We'll mount the code directory to /app
CMD ["python", "ralph_daemon.py"]
