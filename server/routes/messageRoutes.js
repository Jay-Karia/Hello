const express = require('express')

const router = express.Router()
const verifyJWT = require("../middlewares/verifyJWT")

const { sendMessage, allMessages, getMessage } = require("../controllers/messageControllers")


router.route("/").post(verifyJWT, sendMessage)
router.route("/:chatId").get(verifyJWT, allMessages)
router.route("/get/:messageId").get(verifyJWT, getMessage)

module.exports = router