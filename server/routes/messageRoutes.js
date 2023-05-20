const express = require('express')

const router = express.Router()
const verifyJWT = require("../middlewares/verifyJWT")

const { sendMessage, allMessages } = require("../controllers/messageControllers")


router.route("/").post(verifyJWT, sendMessage)
router.route("/:chatId").get(verifyJWT, allMessages)

module.exports = router