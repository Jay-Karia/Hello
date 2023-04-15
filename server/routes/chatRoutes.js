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
router.get("/", verifyJWT, async(req, res) => {
    try {
        Chat.find({ users: req.user })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async(results) => {
                results = await User.populate(results, {
                    path: "latestMessage,sender",
                    select: "name picture email"
                })

                return res.status(200).json({ results: results })
            })
    } catch (error) {
        return res.status(400).json({ error: error })
    }
})

router.post("/group", verifyJWT, async(req, res) => {
    var { users, groupName } = req.body;

    try {
        if (!users || !groupName)
            return res.status(400).json({ msg: "Group name or users not specified" })

        users = JSON.parse(users)

        if (users.length < 2)
            return res.status(400).json({ msg: "more than 2 users required to create group" })

        users.push(req.user)

        const groupChat = await Chat.create({
            chatName: groupName,
            users: users,
            isGroupChat: true,
            groupAdmin: req.body.user,
        })

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        return res.status(200).json({ groupChat: fullGroupChat })

    } catch (error) {
        return res.status(400).json({ err: error })
    }
})

module.exports = router