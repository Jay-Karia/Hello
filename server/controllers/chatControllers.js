const Chat = require("../Models/chatModel")
const User = require("../Models/userModel")

// access chats
const access = async(req, res) => {
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
}

// fetch chats
const fetchChats = async(req, res) => {
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
}

// create group
const createGroup = async(req, res) => {
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
            groupAdmin: req.user.id,
        })

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        return res.status(200).json({ groupChat: fullGroupChat })

    } catch (error) {
        return res.status(400).json({ err: error })
    }
}

// rename group
const renameGroup = async(req, res) => {
    const { chatId, chatName } = req.body;

    try {

        if (!chatId || !chatName)
            return res.status(400).json({ msg: "chat id or chat name not specified" })

        const groupChat = await Chat.findByIdAndUpdate(chatId, { chatName: chatName })

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id }).populate("users", "-password")
            .populate("groupAdmin", "-password")

        return res.status(200).json({ groupChat: fullGroupChat })
    } catch (error) {
        return res.status(400).json({ error: error })
    }
}

// add new User/s to the group
const addUser = async(req, res) => {
    let { chatId, users } = req.body

    try {

        if (!chatId || !users)
            return res.status(400).json({ msg: "chat id or users not specified" })

        users = JSON.parse(users)

        const chat = await Chat.findOne({ _id: chatId })
        var existingUsers = []

        for (var i = 0; i < chat.users.length; i++) {
            const Users = await User.findById(chat.users[i])
            existingUsers[i] = Users.id
        }

        if (req.user.id == chat.groupAdmin) {
            for (var i = 0; i < existingUsers.length; i++) {
                for (var j = 0; j < users.length; j++)
                    if (existingUsers[i] == users[j])
                        return res.status(400).json({ msg: "Cannot add existing user to the group" })

                users.push(existingUsers[i])
            }

            const newChat = await Chat.findByIdAndUpdate(chatId, { users: users })
            const fullNewChat = await Chat.findOne({ _id: newChat._id }).populate("users", "-password").populate("groupAdmin", "-password")

            return res.status(200).json({ chat: fullNewChat })

        } else
            return res.status(400).json({ msg: "not a group admin" })

    } catch (error) {
        return res.status(400).json({ error: error })
    }
}

// remove user/s from the group
const removeUser = async(req, res) => {
    let { chatId, users } = req.body

    try {

        if (!chatId || !users)
            return res.status(400).json({ msg: "chat id or users not specified" })

        users = JSON.parse(users)

        const chat = await Chat.findOne({ _id: chatId })
        var existingUsers = []

        for (var i = 0; i < chat.users.length; i++) {
            const Users = await User.findById(chat.users[i])
            existingUsers[i] = Users.id
        }

        var p = 0

        if (req.user.id == chat.groupAdmin) {
            for (var i = 0; i < existingUsers.length; i++) {
                for (var j = 0; j < users.length; j++) {
                    if (existingUsers[i] === users[j]) {
                        existingUsers.splice(i, 1)
                        const newChat = await Chat.findByIdAndUpdate(chatId, { users: existingUsers })
                        const fullNewChat = await Chat.findOne({ _id: newChat._id }).populate("users", "-password").populate("groupAdmin", "-password")

                        return res.status(200).json({ chat: fullNewChat })
                    } else
                        p = -1;
                }

            }

            if (p != 1)
                return res.status(400).json({ msg: "User does not exists in the group" })


        } else
            return res.status(400).json({ msg: "not a group admin" })

    } catch (error) {
        return res.status(400).json({ error: error })
    }
}

module.exports = { access, fetchChats, createGroup, renameGroup, addUser, removeUser }