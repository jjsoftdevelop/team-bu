const { Base64 } = require('js-base64');
import { sportCate } from "~/constants/sportCate";
import { roleCate } from "~/constants/roleCate";

export default (context, inject) => {
    inject('wait', miliseconds => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, miliseconds)
        })
    })

    inject('encodeBase64', originStr => {
        return originStr ? Base64.encode(originStr).replace('/', '_') : originStr
    })

    inject('decodeBase64', codedStr => {
        return codedStr ? Base64.decode(codedStr.replace('_', '/')) : codedStr
    })

    inject('transforSportIcon', cateID => {
        const src = sportCate[cateID].iconSrc;
        return src;
    })

    inject('transforRoleIcon', cateID => {
        const src = roleCate[cateID].iconSrc;
        return src;
    })

}
