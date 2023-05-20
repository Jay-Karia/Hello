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

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRoutes)