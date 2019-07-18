const baseUrl = './';
const iconfontVersion = ['667895_4y8d30c1og','567566_r22zi6t8noas8aor', '567566_qo5lxgtishg', '599693_dfa50fge714', '667895_2ek3wqcg8w1', '667895_bywepfixwj8']
const iconfontUrl = `//at.alicdn.com/t/font_$key.css`;
const codeUrl = `/code`;
if (process.env.NODE_ENV == 'development') {

} else if (process.env.NODE_ENV == 'production') {

}

export {
    baseUrl,
    iconfontUrl,
    iconfontVersion,
    codeUrl
}
