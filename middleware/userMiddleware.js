function userMiddeware(req, res, next) {
    if (req.session && res.session.userId) {
        req.userId = req.session.userId;
        next()
    }
    else {
        res.status(403).json({
            message: "Unauthorized",
        })
    }
}

module.exports = { userMiddeware }

