const express = require('express')
const router = express.Router()
const sgMail = require("@sendgrid/mail");
const dbConnect = require('../../config/db');

// R - Read
router.post('/sendEmail', async (req, res, next) => {
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
    } catch (error) {
        statusCode = error.code
        responseContent = error.response.body.errors
    }
    dbConnect.query("INSERT INTO email_log(createdate,statusCode,responseContent,emailTo,emailContent,emailTitle) VALUES(?,?,?,?,?,?)", [new Date(), statusCode, JSON.stringify(responseContent), to
        , text, subject
    ], (error, result) => {
        try {
            if (error) {
                throw new Error(error)
            }
            const returnObj = {
                message: statusCode === 202 ? '信件寄出成功' : '信件寄出失敗'
            }
            res.status(statusCode).json(returnObj)
        } catch (error) {
            next(error)
        }
    })
})
// export module
module.exports = router