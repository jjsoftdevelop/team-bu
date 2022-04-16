const multer = require("multer");
const multerGoogleStorage = require("multer-cloud-storage");
const { query } = require('../../config/async-db')
const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const appDir = path.dirname(require.main.filename);
const moment = require('moment');

async function insertDB(filename, createdate, contentType, size, path, linkUrl, destination) {
    let sql = "INSERT INTO file_log(filename, createdate, contentType, size, path, linkUrl, destination) VALUES(?,?,?,?,?,?,?)"
    let values = [filename, createdate, contentType, size, path, linkUrl, destination]
    await query(sql, values)
}

const uploadHandler = multer({
    storage: multerGoogleStorage.storageEngine({
        bucket: 'team-bu',
        projectId: 'team-bu',
        keyFilename: `${appDir}/src/config/key.json`,
        destination: "users/",
        filename(req, file, cb) {
            const now = new Date();
            const format = moment(now).format('YYYYMMDDTHHmmss')
            const customFilename = `${format}_${uuidv4()}${path.extname(file.originalname)}`
            cb(null, customFilename)
        }
    })
});

router.post('/uploadFile', uploadHandler.single('uploadBox'), async (req, res, next) => {
    const now = new Date();
    const file = req.file
    const filename = file.filename
    const createdate = moment(now).format('YYYY/MM/DD HH:mm:ss')
    const contentType = file.contentType
    const size = file.size
    const path = file.path
    const linkUrl = file.linkUrl
    const destination = file.destination
    try {
        await insertDB(filename, createdate, contentType, size, path, linkUrl, destination)
        const returnObj = {
            message: '上傳成功',
            url: linkUrl,
        }
        res.status(200).json(returnObj)
    } catch (err) {
        next(err)
    }

});

// export module
module.exports = router