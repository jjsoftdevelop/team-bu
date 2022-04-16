const serverLogMiddleWare = (req, res, next) => {
    console.log((
        'x-forwarded-for', req.headers["x-forwarded-for"] || "").split(",").pop(),
        'connection.remoteAddress', req.connection.remoteAddress,
        'req.socket.remoteAddress', req.socket.remoteAddress,
        'req.connection.socket.remoteAddress', req.connection.socket.remoteAddress
    )
    const info = {
        hostname: req.hostname,
        baseUrl: req.baseUrl,
        originalUrl: req.originalUrl,
        method: req.method,
        params: req.params,
        body: req.body,
        fresh: req.fresh,
        ip: req.headers['x-real-ip'] || req.connection.remoteAddress || null,
        ips: req.ips,
        cookie: req.cookies,
        date: new Date().toISOString()
    }
    console.log(JSON.stringify(info))
    next()
}
module.exports = serverLogMiddleWare
