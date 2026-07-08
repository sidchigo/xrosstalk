# 🔀 XrossTalk

> Real-time feature flag control & user presence dashboard using RabbitMQ, Redis, WebSockets, and Dockerized microservices.

**XrossTalk** is a reference implementation of the event-driven, real-time architecture patterns I use in production — a backend-centric project demonstrating microservice communication, presence tracking, and feature-flag broadcasting via **RabbitMQ**, **Redis**, and **WebSockets**.

## 📦 Tech Stack

| Layer        | Tech                                       |
| ------------ | ------------------------------------------ |
| Server-Comet | Node.js + Express + TypeScript + WebSocket |
| Server-Orbit | Python + FastAPI                           |
| Messaging    | RabbitMQ (message queuing)                 |
| Presence     | Redis (user tracking and activity logs)    |
| Frontend     | React, Vite + TailwindCSS + ShadCN UI      |
| Infra        | Docker, Docker Compose                     |

## 🎯 Key Features

-   🧑‍💻 **Admin dashboard** to toggle feature flags in real time
-   🟢 **Live presence tracking** of connected users
-   📋 **Activity logs** showing user connection history and status updates
-   🔄 **Cross-server message handling** using RabbitMQ
-   📡 **WebSocket-based real-time UI updates**
-   🔐 **Redis-based presence system** with per-user tracking
-   🎨 **Modern UI** built using ShadCN + Tailwind CSS
-   🧪 Fully **Dockerized** for local or cloud deployment

## 🧩 Architecture Overview

```txt
                        ┌────────────┐
                        │  Admin UI  │
                        └─────┬──────┘
                              │ WebSocket
                        ┌─────▼─────┐
                        │ Server A  │  ◄──── Feature flag control + logs
                        └─────┬─────┘
        RabbitMQ ◄────┐       │       ┌─────► Redis
                      │       ▼       │
                 ┌────┴─────┐   ┌─────┴─────┐
                 │ Server B │   │  Clients  │
                 └──────────┘   └───────────┘
                      ▲
                      │ WebSocket
                      ▼
              Client UI (uses flag if enabled)
```

## 📦 Monorepo Structure

```bash
xrosstalk/
├── apps/
│ ├── frontend/ # React App served via NGINX
│ ├── server-orbit/ # FastAPI Python server
│ └── server-comet/ # Express TS server
├── infra/
│ ├── docker/ # Shared docker configs if any
│ └── dev/ # Local dev env files, .envs etc.
├── docker-compose.yml
└── README.md
```

## 🚀 Running Locally

### Prerequisites

-   Docker + Docker Compose

### 1. Clone the repo

```bash
git clone https://github.com/your-username/xrosstalk.git
cd xrosstalk
```

### 2. Create a .env file from the example

```bash
cp .env.example .env
```

### 3. Start all services

```bash
docker compose up --build
```

## 🔍 Accessing the Services

http://localhost:3000 → Frontend

http://localhost:5000 → Express server

http://localhost:5001 → FastAPI server

## 🧪 Demo Use Case

Imagine a live rollout scenario:
Admin toggles a feature, all online users instantly get the new flag. Only when enabled, users can access the new feature. Presence and activity logs update in real time.

## 🏁 Deployment Plans

🚀 Deploy on Oracle Cloud Free Tier VPS

🌐 Attach a free .tk domain via Freenom + Cloudflare

🔒 Use NGINX + Certbot for HTTPS

🐳 Full deployment via docker-compose (no manual steps)

## 📬 Contact

Open to Senior Software Engineer opportunities in real-time systems / fintech.

Reach me via [LinkedIn](https://www.linkedin.com/in/siddheshnaik26/) or [Email](mailto://sid.naik26@gmail.com)
