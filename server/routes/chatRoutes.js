const express = require('express')
const router = express.Router()

const Chat = require("../Models/chatModel")
const User = require("../Models/userModel")
const verifyJWT = require("../middlewares/verifyJWT")

// access chats
router.post("/", verifyJWT, async(req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ msg: "User id is not defined" })
    }

    var isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user.id } } },
                { users: { $elemMatch: { $eq: userId } } }
            ],
        }).populate("users", "-password")
        .populate("latestMessage")

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name picture email"
    })

    if (isChat.length > 0) {
        res.send(isChat[0])
    } else {
        var chat = await User.find({ _id: userId })
        var chatData = {
            chatName: chat[0].name,
            isGroupChat: false,
            users: [req.user._id, userId]
        }

        try {
            const createdChat = await Chat.create(chatData)
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            )

            return res.status(200).json(fullChat)
        } catch (error) {
            return res.status(400).json({ msg: "Error in creating chat" })
        }
    }
})

// fetch chats
// router.get("/", verifyJWT, async(req, res) => {
//     try {
//         Chat.find({ users: { $elemMatch: { $ep: req.user._id } } })
//             .populate("users", "-password")
//             .populate("groupAdmin", "-password")
//             .populate("latestMessage")
//             .sort({ updatedAt })
//             .then(async(results) => {
//                 results = await User.populate(results, {
//                     path: "latestMessage.sender",
//                     select: "name picture"
//                 })
//             })
//     } catch {

//     }
// })

module.exports = router