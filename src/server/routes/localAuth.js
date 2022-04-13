const { query } = require('../../config/async-db')
const express = require('express')
const router = express.Router()
const axios = require('axios');
const { Base64 } = require('js-base64');
const CryptoJS = require("crypto-js");
const qs = require('querystring');
const jwtDecode = require("jwt-decode");
const { web: keys } = require('../../config/keyForOauth.json')

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

async function isExistEmail(email, provider) {
    let sql = "SELECT COUNT(*) AS Count FROM member WHERE email = ? AND provider = ?"
    let values = [email, provider]
    let dataList = await query(sql, values)
    let isExist = false
    const format = JSON.parse(JSON.stringify(dataList))
    if (format[0].Count !== 0) {
        isExist = true
    }
    return isExist
}
async function insertDB(nickname, email, picture) {
    let sql = "INSERT INTO member(nickname, email, picture,createdate, provider, statusID, levelID) VALUES(?,?,?,?,?,?,?)"
    let values = [nickname, email, picture, new Date(), 'google', 2, 1]
    await query(sql, values)
}

async function verifyPasswd(email, passwdEncode) {
    let sql = "SELECT * FROM member WHERE email = ? AND password = ? AND provider = ? Limit 1"
    let values = [email, passwdEncode, 'user']
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data
}

async function signUp(nickname, email, passwdEncode) {
    let sql = "INSERT INTO member(nickname, email, password , createdate, provider, statusID, levelID) VALUES(?,?,?,?,?,?,?)"
    let values = [nickname, email, passwdEncode, new Date(), 'user', 1, 1]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data.insertId
}

// -------google註冊--------
router.get('/verify/google', (req, res) => {
    const googleOauthUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${keys.client_id}&scope=email%20profile&redirect_uri=${process.env.callbackURL}`
    res.redirect(googleOauthUrl)
})

router.get('/redirect/google', async (req, res) => {
    //取得 google 的 access_token
    try {
        const api_url = "https://oauth2.googleapis.com/token"
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        const token_option = {
            code: req.query.code,
            client_id: keys.client_id,
            client_secret: keys.client_secret,
            grant_type: "authorization_code",
            redirect_uri: `${process.env.callbackURL}`
        };
        // 取得JWT TOKEN 寫入SESSION
        let result = await axios.post(api_url, qs.stringify(token_option), config);
        const id_token = result.data.id_token; //jwt token
        const { email, name: nickname, picture } = jwtDecode(id_token);
        const user = {
            email,
            nickname,
            picture
        }
        req.session.user = user
        // 判斷是否存在DB google登入方式
        const isExist = await isExistEmail(email, 'google')
        // 寫入DB
        if (!isExist) {
            await insertDB(nickname, email, picture)
            res.redirect('/');
        } else {
            res.redirect('/');
        }
    }
    catch (e) {
        console.log(e)
        res.redirect('/');
        res.end();
    }
})

// -------自行註冊--------
// 驗證email
router.post('/verify/email', async function (req, res, next) {
    const email = req.body.email
    // 判斷是否存在DB 自行登入方式
    try {
        const isExist = await isExistEmail(email, 'user')
        const returnObj = {}
        if (!isExist) {
            returnObj.message = '無帳號'
            returnObj.nextStep = 'signin'
        } else {
            returnObj.message = '有帳號'
            returnObj.nextStep = 'login'
        }
        res.status(200).json(returnObj)
    } catch (err) {
        next(err)
    }
});

// 驗證密碼
router.post('/verify/passwd', async function (req, res, next) {
    try {
        const passwd = req.body.passwd
        const passwdEncode = CryptoJS.MD5(passwd).toString();
        const email = req.body.email
        let returnObj = {}
        let data = await verifyPasswd(email, passwdEncode)
        if (!data || data.length === 0) {
            returnObj.message = '密碼錯誤'
            returnObj.type = '1'
            res.status(402).json(returnObj)
        } else {
            returnObj.message = '登入成功'
            returnObj.type = '2'
            const { nickname, picture } = data[0]
            const user = {
                email,
                nickname,
                picture
            }
            req.session.user = user
            res.status(200).json(returnObj)
        }
    } catch (err) {
        next(err)
    }
});

// 註冊帳號
router.post('/signUp', async function (req, res, next) {
    try {
        const email = req.body.email
        const passwd = req.body.passwd
        const passwdEncode = CryptoJS.MD5(passwd).toString();
        const nickname = req.body.nickname
        const insertId = await signUp(email, passwdEncode, nickname)
        if (insertId) {
            const returnObj = {
                message: '待驗證帳號'
            }
            const { status } = await axios.post(`${process.env.baseUrl}/auth/sendVerifycode?mailto=${email}&nickname=${Base64.encode(nickname)}`)
            res.status(status).json(returnObj)
        } else {
            const returnObj = {
                message: '註冊失敗'
            }
            res.status(402).json(returnObj)
        }

    } catch (err) {
        next(err)
    }

});

// 發送驗證碼
router.post('/sendVerifycode', async function (req, res, next) {
    try {
        const mailto = req.query.mailto
        const nickname = Base64.decode(req.query.nickname)
        const verifycode = Math.random().toFixed(6).slice(-6).toString()
        const emailRes = await axios.post(`${process.env.baseUrl}/api/sendEmail`, {
            mailto,
            mailTitle: `team-bu驗證信`,
            mailContent: `Hello ${nickname} ~ 這是您的驗證碼${verifycode}`
        })
        res.json({ status: emailRes.status })
    } catch (err) {
        next(err)
    }
})


module.exports = router
