const Chat = require("../Models/chatModel")
const User = require("../Models/userModel")
const Message = require("../Models/messageModel")

// send message
const sendMessage = (async(req, res) => {
    const { content, chatId } = req.body

    if (!content || !chatId) {
        return res.status(400).json({ msg: "Please specify the message or chat", status: "error" })
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }

    try {
        var message = await Message.create(newMessage)
        message = await message.populate("sender", "name pic")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: "chat.users",
            select: "name email pic"
        })

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message
        })

        return res.status(200).json({ msg: "Message sent successfully", status: "success", message: message })

    } catch (error) {
        return res.status(200).json({ msg: "Could not send message", status: "error", error: error })
    }
})

// all messages
const allMessages = async(req, res) => {
    const chatId = req.params.chatId
    try {
        const messages = await Message.find({ chat: chatId })
            .populate("sender", "name pic email")
            .populate("chat")


        return res.status(200).json({ msg: "All messages accessed successfully", status: "success", messages: messages })
    } catch (error) {
        return res.status(400).json({ msg: "Error occurred while accessing messages", status: "error", error: error })
    }

}

module.exports = { sendMessage, allMessages }