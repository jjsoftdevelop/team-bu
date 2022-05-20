const checkLoginMiddleWare = function (req, res, next) {
    console.log('req.path===>', req.path);
    if (req.path) {
        if (req.session.user && req.session.user.pid) {
            next()
        } else {
            if (!req.originalUrl.startsWith('/login')) {
                res.redirect("/login")
                return next();
            } else {
                next()
            }
        }
    } else {
        next()
    }
}

module.exports = checkLoginMiddleWare