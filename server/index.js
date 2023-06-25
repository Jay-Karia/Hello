const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors')

const connectDB = require("./config/connectDB");

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors())

connectDB();

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRoutes)

// Socket IO
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
})

io.on('connection', (socket) => {
    console.log("Connected to socket.io")
})