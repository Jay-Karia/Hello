const express = require("express");
const router = express.Router();
const User = require("../Models/userModel");

router.post("/register", async(req, res) => {});

router.get("/", (req, res) => {
    res.send("Hello");
});

module.exports = router;