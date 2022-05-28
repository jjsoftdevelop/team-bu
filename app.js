const express = require('express')
const app = express()
const nuxtConfig = require('./nuxt.config.js')
const apiRouter = require('./src/server/routes')
const { Nuxt, Builder } = require('nuxt')
const session = require('express-session')
const swaggerUi = require('swagger-ui-express')
const swaggerSetting = require('./src/config/swagger')
const serverLogMiddleWare = require('./src/server/middleware/serverLogMiddleWare')
const checkLoginMiddleWare = require('./src/server/middleware/checkLoginMiddleWare')
const firebaseKey = require('./src/config/keyForFirebase.json')
const FirebaseStore = require('connect-session-firebase')(session);
const firebase = require('firebase-admin');
const ref = firebase.initializeApp({
    credential: firebase.credential.cert(firebaseKey),
    databaseURL: process.env.FIREBASE_DATABASEURL
});
const cookieParser = require('cookie-parser')
const csrf = require('./src/server/middleware/csrf')
const helmet = require('helmet')

// 載入所有env環境變數
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
// 取得body
app.use(
    express.urlencoded({
        extended: true
    })
)

// This is where you put the URL of your frontend
app.use(express.json())

// 加入middleware
// 加入 serverLogmiddleware (輸出log)
app.use(serverLogMiddleWare)
// 加入cookieParser
app.use(cookieParser())
// 加入 session middleware (session 初始化)
app.use(session({
    store: process.env.NODE_ENV !== 'dev' ? new FirebaseStore({
        database: ref.database()
    }) : '',
    name: 'user',
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        // secure: process.env.NODE_ENV !== 'dev',
        secure: false,
        maxAge: 1000 * 60 * 99999,
        httpOnly: true,
    }
}))
// app.use(helmet({
//     contentSecurityPolicy: false,
// }))
// 加入swagger ui 路由
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSetting))

// 可直接存取公開資源
app.use('/', express.static('public'))
app.use('/build', express.static('build'))
app.use('/', (req, res, next) => {
    next()
})
app.use('/login', (req, res, next) => {
    next()
})
app.use('/home', checkLoginMiddleWare, (req, res, next) => {
    next()
})
app.use('/team', checkLoginMiddleWare, (req, res, next) => {
    next()
})

async function start() {
    // Init Nuxt.js
    const nuxt = new Nuxt(nuxtConfig)
    // 取得nuxt port host 資訊
    const { host, port } = nuxt.options.server
    // Build only in dev mode
    if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'local') {
        const builder = new Builder(nuxt)
        await builder.build()
    }
    // 加入 csrf
    app.use(csrf)
    // 加入 api Router
    app.use(apiRouter)
    // handleErrorMiddle 統一處理錯誤
    app.use((error, req, res, next) => {
        console.log("Error Handling Middleware called")
        console.log('Path: ', req.path)
        console.error('Error: ', error)
        if (error.type == 'redirect')
            res.redirect('/error')
        else if (error.type == 'time-out') // arbitrary condition check
            res.status(408).send(error)
        else
            res.status(500).json({ 'message': 'failed!!' })
    })

    // 通过 nuxt.render 函数，把 Nuxt.js 变成你 Node.js 服务端的中间件。
    // 建议把 nuxt.render 放到中间件列表的最后面，因为它不会再调用 next() 方法，而是直接处理你 web 应用的页面渲染。
    app.use(nuxt.render)

    // 啟動 node server
    app.listen(port, host, () => {
        console.log('server is listen', + port);
    })
}

start()
