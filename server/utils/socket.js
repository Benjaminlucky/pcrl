// utils/socket.js
import { Server } from "socket.io";

let io; // this will hold the singleton instance

// Initialize Socket.IO once — called from index.js
export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", // or your frontend URL (e.g. http://localhost:5173)
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Connection events
  io.on("connection", (socket) => {
    console.log("🟢 New client connected:", socket.id);

    // Optional: handle joining admin rooms
    socket.on("joinAdmin", () => {
      socket.join("admins");
      console.log(`👑 Admin joined room: ${socket.id}`);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });

  return io;
}

// Get the io instance from anywhere
export function getSocketIO() {
  if (!io) {
    console.warn("⚠️ Socket.io not initialized yet!");
  }
  return io;
}
