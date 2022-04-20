const authMiddleWare = function (req, res, next) {
    if (req.session.user && req.session.user.pid) {
        console.log('authenticated')
        next()
    } else {
        console.log('not authenticated')
        res.status(402).json({ message: '無權限' })
    }
}

module.exports = authMiddleWare
