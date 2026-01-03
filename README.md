# Optimistic Updates with Confirmed Persistence (SSE)

This project demonstrates a **real-time data flow** using **Server-Sent Events (SSE)** that follows an **Optimistic UI Update with Confirmed Persistence** pattern.

The goal is to:

* Immediately reflect incoming data on the UI (optimistic update)
* Confirm durability by persisting the same data on the backend
* Keep the SSE connection open and reliable
* Ensure the UI remains stable until new data arrives
  
## 🧠 What Problem Does This Solve?

In real-time systems:

* Users expect **instant feedback**
* Backends must still **guarantee persistence**
* UI should **not flicker or reset** while waiting for the next event

This pattern ensures:

* Low latency UI updates
* Reliable backend writes
* Clear separation between **streaming** and **storage**

---

## 🔄 Architecture Overview

```
Client (UI)
   │
   │ 1. POST data
   ▼
Backend API
   │
   │ 2. Optimistically broadcast via SSE
   ▼
SSE Clients (Live UI update)
   │
   │ 3. Persist data (DB / File)
   ▼
Confirmed Storage
```

---

## ⚡ Data Flow Explained

### 1️⃣ Client sends data

The client sends data using a regular HTTP POST request.

```http
POST /api/data
```

---

### 2️⃣ Optimistic broadcast (SSE)

As soon as data is received:

* It is **broadcast to all connected SSE clients**
* UI updates immediately

```js
clients.forEach(send => send(data));
```

At this stage:

* No DB confirmation yet
* UI assumes success (optimistic update)

---

### 3️⃣ Confirmed persistence

After broadcasting:

* Data is persisted (file / database)
* API responds with success or failure

```js
writeFileSync("data.json", JSON.stringify(data, null, 2));
```

If persistence fails:

* Backend returns `500`
* UI can optionally reconcile or retry

---

## 🖥️ UI Behavior

### Expected behavior:

* Last received data **remains visible**
* UI does **not reset** to “waiting” after each event
* UI updates **only when new SSE data arrives**

This is achieved by:

* Storing SSE data in state / store
* Not clearing state on connection idle

---

## 📡 SSE Endpoint

```http
GET /api/events
```

### SSE Semantics:

* Long-lived HTTP connection
* Status remains **pending** in browser DevTools (expected)
* Server never “completes” the response

```js
res.setHeader("Content-Type", "text/event-stream");
res.setHeader("Cache-Control", "no-cache");
res.setHeader("Connection", "keep-alive");
```

---

## 🔐 Why SSE (and not WebSockets)?

| Feature       | SSE             | WebSocket     |
| ------------- | --------------- | ------------- |
| Direction     | Server → Client | Bidirectional |
| Reconnect     | Automatic       | Manual        |
| Simplicity    | Very High       | Medium        |
| HTTP friendly | Yes             | No            |

SSE is ideal for:

* Live dashboards
* Logs / metrics
* Streaming updates
* Event notifications

---

## 🧪 Optimistic Update Guarantees

| Stage          | Guarantee                |
| -------------- | ------------------------ |
| SSE broadcast  | Low latency UI update    |
| Persistence    | Data durability          |
| UI store       | Stability between events |
| SSE connection | Real-time delivery       |

---

## 🚀 Running Locally

```bash
npm install
npm run dev
```

Open:

```
http://localhost:5500
```

Backend:

```
http://localhost:3001
```

---

## 📌 Key Takeaways

* **SSE connections remain pending by design**
* UI state must live **outside** the SSE lifecycle
* Optimistic updates improve perceived performance
* Persistence confirms system correctness
* This pattern scales well for read-heavy real-time systems

---

## 🔮 Possible Enhancements

* Add persistence confirmation events
* Add retry / rollback strategy
* Add event IDs for replay
* Replace file storage with MongoDB / PostgreSQL
* Add heartbeat (`:ping`) for connection health

---
