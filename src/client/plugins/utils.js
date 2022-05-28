const { Base64 } = require('js-base64');
import { sportCate } from "~/constants/sportCate";
import { roleCate } from "~/constants/roleCate";
import { ToastPlugin } from 'bootstrap-vue'

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

    inject('transforRoleBigIcon', cateID => {
        const src = roleCate[cateID].iconBigSrc;
        return src;
    })

    inject('showToast', ({ content, title, variant = 'danger' }) => {
        $nuxt.$bvToast.toast(content, {
            title: `${title ? title : '提示'}`,
            variant: variant,
            solid: true,
            toaster: 'b-toaster-bottom-center',
            appendToast: false,
        })
    })
}
