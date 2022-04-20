const express = require('express')
const sendEmailRouter = require('./sendEmail')
const uploadFileRouter = require('./uploadFile')
const localAuthRouter = require('./localAuth')
const teamsRouter = require('./teams')


const apiRouter = express.Router()

apiRouter.use('/api', sendEmailRouter)
apiRouter.use('/api', uploadFileRouter)
apiRouter.use('/api', teamsRouter)
apiRouter.use('/auth', localAuthRouter)

module.exports = apiRouter