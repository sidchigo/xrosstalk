# 🔀 XrossTalk

> Real-time cross-server messaging using RabbitMQ, Redis, WebSockets & Dockerized microservices.

XrossTalk is a backend-focused portfolio project designed to showcase inter-service communication, real-time WebSocket handling, and distributed architecture. It features **two backend servers** (Node.js + Express + TypeScript, and Python + Flask), each with its **own MongoDB database** and **WebSocket server**. Communication between these services is enabled using **RabbitMQ** and **Redis Pub/Sub**, demonstrating microservice decoupling in action.

Frontend is built in **React**, providing a simple UI to test real-time messaging and user presence across services.

---

## 📦 Tech Stack

| Layer        | Tech                                                |
| ------------ | --------------------------------------------------- |
| Server-Comet | Node.js + Express + TypeScript + WebSocket          |
| Server-Orbit | Python + FastAPI                                    |
| Messaging    | RabbitMQ (message queuing), Redis (Pub/Sub)         |
| Databases    | MongoDB (per service)                               |
| Frontend     | React (Vite or Next.js)                             |
| Infra        | Docker, Docker Compose                              |
| Architecture | Monorepo, Microservices, WebSockets, Message Broker |

---

## 🧩 Architecture Overview

-   Each server is a standalone microservice (API + WebSocket + MongoDB)
-   Redis is used for **presence broadcasting** across services
-   RabbitMQ handles **message delivery queues**
-   Docker Compose runs all services locally in a single orchestrated network
-   WebSocket clients (in frontend) connect to their respective backend server
-   Users can see all active users (merged via Redis) and chat with anyone (messages routed via RabbitMQ)
