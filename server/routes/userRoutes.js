const express = require("express");
const router = express.Router();
const verifyJWT = require("../middlewares/verifyJWT")

const { register, login, searchUser } = require('../controllers/userControllers')

router.post("/register", register);
router.post('/login', login)
router.post('/', verifyJWT, searchUser)

module.exports = router;