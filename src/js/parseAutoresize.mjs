import isobj from 'wsemi/src/isobj.mjs'
import isfun from 'wsemi/src/isfun.mjs'


/**
 * 解析組件之autoresize設定
 *
 * @param {Boolean|Object} autoresize 輸入autoresize設定，為布林值或物件{throttle,onResize}
 * @returns {Object} 回傳物件{enabled,throttle,onResize}，enabled為是否啟用布林值，throttle為節流毫秒數(取整，未給或非有限數字時為100，0或負數為0即不節流)，onResize為函數或null
 * @example
 *
 * console.log(parseAutoresize(true))
 * // => { enabled: true, throttle: 100, onResize: null }
 *
 * console.log(parseAutoresize({ throttle: 50 }))
 * // => { enabled: true, throttle: 50, onResize: null }
 *
 * console.log(parseAutoresize(false))
 * // => { enabled: false, throttle: 100, onResize: null }
 *
 */
function parseAutoresize(autoresize) {

    //enabled
    let enabled = !!autoresize

    //opt
    let opt = isobj(autoresize) ? autoresize : {}

    //throttle, 取整並不小於0: 偵測器(wsemi domDetect)之throttle須為正整數, 非整數會被視為無效而不節流
    let throttle = Number.isFinite(opt.throttle) ? Math.max(0, Math.round(opt.throttle)) : 100

    //onResize
    let onResize = isfun(opt.onResize) ? opt.onResize : null

    return {
        enabled,
        throttle,
        onResize,
    }
}


export default parseAutoresize
