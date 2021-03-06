const express = require('express')
const router = express.Router()
const sgMail = require("@sendgrid/mail");
const { insertEmailDB } = require('../sql/sqlEmailStr')

// R - Read
router.post('/sendEmail', async (req, res, next) => {
    try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const to = req.body.mailto
        const subject = req.body.mailTitle
        const text = req.body.mailContent
        const msg = {
            to, // Change to your recipient
            from: "team-bu-system@team-bu.com", // Change to your verified sender
            subject,
            text,
        };
        let statusCode, responseContent
        try {
            const response = await sgMail.send(msg)
            statusCode = response[0].statusCode
            responseContent = response[0].body
        } catch (err) {
            statusCode = err.code
            responseContent = err.response.body.errors
        }
        try {
            await insertEmailDB(statusCode, statusCode, responseContent, to, text, subject)
            const returnObj = {
                message: statusCode === 202 ? '信件寄出成功' : '信件寄出失敗'
            }
            res.status(statusCode).json(returnObj)
        } catch (err) {
            next(err)
        }
    } catch (err) {
        next(err)
    }
})
// export module
module.exports = router