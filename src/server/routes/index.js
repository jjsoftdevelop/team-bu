const express = require('express')
const CRUDRouter = require('./CRUD')
const sendEmailRouter = require('./sendEmail')
const uploadFileRouter = require('./uploadFile')

const apiRouter = express.Router()

apiRouter.use('/api', CRUDRouter)
apiRouter.use('/api', sendEmailRouter)
apiRouter.use('/api', uploadFileRouter)

module.exports = apiRouter