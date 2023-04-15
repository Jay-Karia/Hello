const express = require('express')
const router = express.Router()

const Chat = require("../Models/chatModel")
const User = require("../Models/userModel")
const protect = require("../middlewares/verifyJWT")

// access chat
router.post("/", async(req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ msg: 'User Id not defined', status: "error" })
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: req.user.userId } } },
        ]
    }).populate("users", "-password").populate("latestMessage")

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: "name picture email"
    })

    if (isChat.length > 0) {
        res.send(isChat[0])
    } else {
        var chatData = {
            chatName: "sender",
            usGroupChat: false,
            users: [req.user._id, userId]
        }
        try {
            const createdChat = await Chat.create(chatData);
            const fulChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
            res.status(200).json("Chat created")
        } catch (error) {
            return res.status(400).json({ error: error })
        }
    }


})

// fetch chats
// router.get("/", protect, async(req, res) => {
//     try {
//         Chat.find({ users: { $elemMatch: { $ep: req.user._id } } })
//             .populate("users", "-password")
//             .populate("groupAdmin", "-password")
//             .populate("latestMessage")
//             .sort({ updatedAt })
//             .then(async(results) => {
//                 results = await User.populate(results, {
//                     path: "latestMessage.sender",
//                     select: "name picture email"
//                 })
//             })
//     } catch {

//     }
// })