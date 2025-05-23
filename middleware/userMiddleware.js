function userMiddleware(req, res, next) {
    if (req.session && req.session.userId) {
        req.userId = req.session.userId;
        next()
    }
    else {
        res.status(403).json({
            message: "Unauthorized",
        })
    }
}

module.exports = { userMiddleware };

