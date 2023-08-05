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

    socket.on('setup', (userData) => {
        socket.join(userData._id)
            // console.log(userData._id)
        socket.emit("connected")
    })

    socket.emit('connection')

    socket.on("join chat", (room) => {
        socket.join(room)
    })

    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.message.chat
        if (!chat.users) return console.log("chat.users not defined")

        chat.users.forEach(user => {
            if (user._id != newMessageReceived.message.sender._id) return

            socket.in(chat._id).emit("message received", newMessageReceived)
        })
    })
})
