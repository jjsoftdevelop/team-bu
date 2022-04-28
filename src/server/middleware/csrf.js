const csurf = require('csurf')
const csrf = csurf({ cookie: true })

const checkCsrf = (req, res, next) => {
    const ip =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null)
    if (
        req.hostname.includes('127.0.0.1') ||
        ip.includes('127.0.0.1')
    ) {
        next()
    } else {
        csrf(req, res, next)
    }
}

module.exports = checkCsrf
