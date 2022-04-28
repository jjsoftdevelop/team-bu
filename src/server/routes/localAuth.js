const express = require('express')
const router = express.Router()
const axios = require('axios');
const CryptoJS = require("crypto-js");
const qs = require('querystring');
const jwtDecode = require("jwt-decode");
const { web: keys } = require('../../config/keyForOauth.json')
const base64Obj = require('../utils/base64')
const {
    isExistEmail,
    isVerifyEmail,
    insertVerifyCodeDB,
    googleSignUp,
    userSignUp,
    verifyPasswd,
    updateEmailStatus,
    isExistVerifyCode,
    updatepasswd,
    isExistVerifyCodeLast,
} = require('../sql/sqlAuthStr')

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
// -------登出--------
router.post('/logout', (req, res) => {
    try {
        req.session.destroy(() => {
            console.log('session && cookie destroyed')
            res.clearCookie('user')
            res.status(200).json({ 'message': '登出成功' })
        })
    } catch (err) {
        next(err)
    }
})

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
        // 判斷是否存在DB google登入方式
        const data = await isExistEmail(email, 'google')
        // 寫入DB
        if (!data) {
            const pid = await googleSignUp(nickname, email, picture)
            const user = {
                pid: base64Obj.encode(pid),
                email,
                nickname,
                picture
            }
            req.session.user = user
            res.redirect('/');
        } else {
            const user = {
                pid: base64Obj.encode(data.pid),
                email,
                nickname,
                picture
            }
            req.session.user = user
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
    // 判斷是否存在DB 自行登入方式
    try {
        const email = req.body.email
        const data = await isExistEmail(email, 'user')
        const returnObj = {}
        if (!data) {
            // 判斷是否驗證過帳號
            const isExistVerifyEmail = await isVerifyEmail(email)
            // type: 1.已驗證通過 2.email未驗證過 發送驗證信 3.已有帳號
            if (isExistVerifyEmail) {
                returnObj.message = '已驗證通過'
                returnObj.type = '1'
                res.status(200).json(returnObj)
            } else {
                returnObj.message = '已發送驗證碼'
                returnObj.type = '2'
                const { status } = await axios.post(`${process.env.BASE_URL}/auth/sendVerifycode?mailto=${email}`)
                res.status(status).json(returnObj)
            }
        } else {
            returnObj.message = '有帳號'
            returnObj.type = '3'
            res.status(200).json(returnObj)
        }
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
        // type: 1.密碼錯誤 2.登入成功 
        if (!data) {
            returnObj.message = '密碼錯誤'
            returnObj.type = '1'
            res.status(402).json(returnObj)
        } else {
            returnObj.message = '登入成功'
            returnObj.type = '2'
            const { nickname, picture, pid } = data
            const user = {
                pid: base64Obj.encode(pid),
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
        const url = req.body.url
        const data = await isExistEmail(email, 'user')
        if (!data) {
            const insertId = await userSignUp(nickname, email, passwdEncode, url)
            // type: 1.註冊成功 2.註冊失敗 3.重複註冊
            if (insertId) {
                const returnObj = {
                    message: '註冊成功',
                    type: '1'
                }
                const user = {
                    pid: base64Obj.encode(insertId),
                    email,
                    nickname,
                    picture: url
                }
                req.session.user = user
                res.status(200).json(returnObj)
            } else {
                const returnObj = {
                    message: '註冊失敗',
                    type: '2'
                }
                res.status(402).json(returnObj)
            }
        } else {
            const returnObj = {
                message: '重複註冊',
                type: '3'
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
        const verifycode = Math.random().toFixed(6).slice(-6).toString()
        const ip = req.headers['x-real-ip'] || req.connection.remoteAddress || null
        await insertVerifyCodeDB(mailto, verifycode, ip)
        const emailRes = await axios.post(`${process.env.BASE_URL}/api/sendEmail`, {
            mailto,
            mailTitle: `team-bu驗證信`,
            mailContent: `您好 ~ 這是您的驗證碼${verifycode}`
        })
        res.json({ status: emailRes.status })
    } catch (err) {
        next(err)
    }
})

// 確認驗證碼
router.post('/enterVerifycode', async function (req, res, next) {
    try {
        let returnObj = {}
        const email = req.body.email
        const verifycode = req.body.verifycode.toString()
        const data = await isExistVerifyCode(email)
        if (verifycode === data.verifycode) {
            await updateEmailStatus(email)
            returnObj.message = '已驗證通過'
            returnObj.type = '1'
            res.status(200).json(returnObj)
        } else {
            returnObj.message = '驗證失敗'
            returnObj.type = '0'
            res.status(402).json(returnObj)
        }
    } catch (err) {
        next(err)
    }
})

// 重設密碼
router.post('/settingPasswd', async function (req, res, next) {
    try {
        const passwd = req.body.passwd
        const email = req.body.email
        const passwdEncode = CryptoJS.MD5(passwd).toString();
        const userVerifycode = req.body.verifycode.toString()
        const { verifycode } = await isExistVerifyCodeLast(email)
        let returnObj = {}

        if (userVerifycode === verifycode) {
            const success = await updatepasswd(passwdEncode, email)
            if (success) {
                const { pid, picture, nickname } = await isExistEmail(email, 'user')
                const user = {
                    pid: base64Obj.encode(pid),
                    email,
                    nickname,
                    picture
                }
                req.session.user = user
                returnObj.message = '以修改成功'
                returnObj.type = '1'
                res.status(200).json(returnObj)
            } else {
                returnObj.message = '修改失敗'
                returnObj.type = '0'
                res.status(402).json(returnObj)
            }
        } else {
            returnObj.message = '驗證失敗'
            returnObj.type = '0'
            res.status(402).json(returnObj)
        }
    } catch (err) {
        next(err)
    }
})


module.exports = router
