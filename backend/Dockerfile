FROM python:3.9-slim-buster
EXPOSE 5143
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    AWS_REGION=us-west-2 \
    HOST_NAME=0.0.0.0 \
    PORT_NUMBER=5143
RUN export DEBIAN_FRONTEND=noninteractive \
    && apt-get -qq -y update \
    && apt-get install -y --no-install-recommends --no-install-suggests -o Dpkg::Options::="--force-confold" -y \
    curl \
    procps \
    vim \
    tzdata \
    bash \
    python3-pip \
    ca-certificates \
    build-essential \
    gcc \
    python3-dev \
    apt-utils \
    musl-dev \
    adduser \
    && apt-get clean \
    && apt-get autoclean \
    && rm -fr /var/lib/apt/lists/* \
    && ln -sf /usr/share/zoneinfo/UTC /etc/localtime \
    && useradd -d /home/app -G 0 -m app -p app -u 1000 \
    && export DEBIAN_FRONTEND=dialog

WORKDIR /app
COPY --chown=app:0 . /app
# Install the virutal env.
RUN python -m venv /app/.venv \
    && pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir --use-pep517 -r requirements.txt
#ENTRYPOINT ["uvicorn"]
CMD ["python3", "main.py"]
