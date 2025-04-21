function adminMiddleware(req, res, next) {


    if (req.session && req.session.adminId) {
        req.adminId = req.session.adminId;
        next();
    }
    else {
        res.status(403).json({
            message: "Unauthorized",
        })
    }
}

module.exports = { adminMiddleware };