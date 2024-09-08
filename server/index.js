import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const PORT = 8000;

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    // origin: "*",
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = {};

const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
};

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  socket.on("join", ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const client = getAllConnectedClients(roomId);
    //notify to all user that new user joined
    client.forEach(({ socketId }) => {
      io.to(socketId).emit("newUserJoined", {
        client,
        username,
      });
    });
  });

	socket.on('code-change',({roomId,code})=>{
		socket.in(roomId).emit('code-change', {code});
	});

	socket.on('sync-code',({socketId,code})=>{
    console.log(code)
		io.to(socketId).emit('code-change', {code});
	});

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((room) => {
      socket.in(room).emit("disconnected", {
        username: userSocketMap[socket.id],
        socketId: socket.id,
      });
    });
		delete userSocketMap[socket.id];
		socket.leave();
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
