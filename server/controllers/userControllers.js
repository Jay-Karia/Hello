const generateToken = require("../config/generateToken")
const User = require("../Models/userModel");

const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

// register
const register = async(req, res) => {
    const user = req.body
    user.password = await bcrypt.hash(user.password, 10)
    user.name = user.name.toLowerCase()
    user.email = user.email.toLowerCase()

    const existingUser = await User.findOne({ email: user.email })
    if (existingUser) return res.status(400).json({ msg: 'User already exists. Try to Login instead', status: 'error' })

    let newUser;
    let token;

    try {
        newUser = new User(user)
        token = generateToken(newUser.id)
        newUser.save()
    } catch (err) {
        return res.status(500).json({ msg: 'Sorry! Some internal server error', error: err, status: 'error' })
    }
    return res.status(200).json({ user: newUser, status: 'ok', msg: 'Successfully Logged In!', token: token })
}

// login
const login = async(req, res) => {
    const user = req.body
    try {
        const existingUser = await User.findOne({ email: user.email })
        if (existingUser) {
            bcrypt.compare(user.password, existingUser.password).then(match => {
                if (match) {
                    const payload = {
                        id: existingUser._id,
                    }
                    jwt.sign(payload, process.env.JWT_SECRET,
                        (err, token) => {
                            if (err) return res.status(400).json({ msg: err, status: "error" })
                            return res.status(200).json({ user: existingUser, status: 'ok', msg: 'Successfully Logged In!', token: 'Bearer ' + token })
                        })
                } else {
                    return res.status(400).json({ msg: 'Email or password does not match', status: 'error' })
                }
            })
        } else {
            return res.status(400).json({ msg: 'Email or password does not match', status: 'error' })
        }
    } catch (err) {
        return res.status(500).json({ msg: 'Sorry! Some internal server error', error: err, status: 'error' })
    }
}

// search user
const searchUser = async(req, res) => {
    const search = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]

    } : {};
    const users = await User.find(search).find({ _id: { $ne: req.user.id } })
    return res.send(users)
}

module.exports = { register, login, searchUser }