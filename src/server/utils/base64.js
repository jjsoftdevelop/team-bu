const { Base64 } = require('js-base64');
const base64Obj = {}

base64Obj.decodeNumber = (codedStr) => {
    return codedStr ? Number(Base64.decode(codedStr.replace('_', '/'))) : codedStr
}

base64Obj.decodeString = (codedStr) => {
    return codedStr ? Base64.decode(codedStr.replace('_', '/')) : codedStr
}

base64Obj.encode = (originStr) => {
    return originStr ? Base64.encode(originStr.toString()).replace('/', '_') : originStr
}
module.exports = base64Obj