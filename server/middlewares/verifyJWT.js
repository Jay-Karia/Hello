const jwt = require('jsonwebtoken')
const User = require('../Models/userModel')

async function verifyJWT(req, res, next) {
    try {
        const token = req.headers['authorization'].split(' ')[1]
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, async(err, decoded) => {
                if (err) {
                    return res.json({
                        isLoggedIn: false,
                        msg: 'Failed to Authenticate',
                        err: err
                    })
                } else {
                    const user = await User.findById(decoded.id)
                    req.user = user
                    next()
                }
            })
        } else {
            res.json({
                msg: 'Login to use this feature',
                status: "error"
            })
        }
    } catch (err) {
        res.json({
            msg: 'Incorrect Token given',
            status: "error"
        })
    }
}

module.exports = verifyJWT