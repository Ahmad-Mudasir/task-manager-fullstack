import "dotenv/config";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { createApp } from "./app.js";

const app = createApp();
const port = Number(process.env.PORT || 4000);
const server = http.createServer(app);

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || corsOrigin,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.emit("connection-status", { connected: true });
});

// Make io available to routes
app.set("io", io);

app.get("/", (_req, res) =>
  res.json({ name: "Task Manager API", status: "ok" })
);

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});
