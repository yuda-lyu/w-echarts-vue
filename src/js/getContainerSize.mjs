/**
 * 取得echarts容器可用尺寸，量測方式與echarts(zrender)相同，即clientWidth/clientHeight扣除padding(parseInt)，見zrender/lib/canvas/helper.js之getSize，
 * 供v-domresize之getSize與圖表getWidth()、getHeight()比較，容器寬高為小數時(例如百分比寬度)亦不誤判
 *
 * @param {HTMLElement} el 輸入容器元素
 * @returns {Object} 回傳物件{width,height}，單位px，不小於0
 * @example
 *
 * //容器clientWidth為1000、padding左右各20.7px
 * console.log(getContainerSize(el))
 * // => { width: 960, height: 300 }
 *
 */
function getContainerSize(el) {

    //pint, 同zrender之parseInt10
    let pint = (v) => parseInt(v, 10) || 0

    //stl
    let stl = window.getComputedStyle(el)

    return {
        width: Math.max(0, el.clientWidth - pint(stl.paddingLeft) - pint(stl.paddingRight)),
        height: Math.max(0, el.clientHeight - pint(stl.paddingTop) - pint(stl.paddingBottom)),
    }
}


export default getContainerSize
