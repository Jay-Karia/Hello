const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./config/connectDB");

const userRoutes = require("./routes/userRoutes");

const app = express();
dotenv.config();
app.use(express.json());

connectDB();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// app.use("/", postRoutes);
app.use("/", userRoutes);