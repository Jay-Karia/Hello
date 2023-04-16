const express = require('express')
const router = express.Router()
const verifyJWT = require("../middlewares/verifyJWT")

const { access, fetchChats, createGroup, renameGroup, addUser, removeUser } = require('../controllers/chatControllers')

router.post("/", verifyJWT, access)
router.get("/", verifyJWT, fetchChats)
router.post("/group", verifyJWT, createGroup)
router.post("/group/rename/", renameGroup)
router.post("/group/add", verifyJWT, addUser)
router.post("/group/remove", verifyJWT, removeUser)

module.exports = router