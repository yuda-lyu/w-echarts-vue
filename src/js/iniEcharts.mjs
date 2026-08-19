import * as echarts from 'echarts'
import 'echarts-gl'


/**
 * 初始化echarts, 直接引用echarts與echarts-gl不使用cdn
 *
 * echarts採全量引入(import 'echarts'), 已自動註冊全部內建圖表(line, bar, pie, scatter, radar, heatmap, tree, treemap, sunburst, parallel, custom等)
 * 與全部內建組件(title, legend, tooltip, toolbox, dataZoom, visualMap, grid, polar, geo等), 故使用時不須另外呼叫echarts.use註冊
 *
 * echarts-gl為3D擴充模組, 匯入時即自行向echarts註冊bar3D, line3D, scatter3D, surface, lines3D等圖表, 以及grid3D, geo3D, globe等座標系,
 * 其package.json已正確宣告sideEffects白名單(index.js與lib/export/all.js等), 故純副作用引入不會被tree-shaking移除
 *
 * 注意: echarts-gl之esm原始碼含無副檔名之深層引用(如'zrender/lib/core/LRU', 'echarts/lib/util/layout'),
 * 而echarts與zrender之package.json exports末端為萬用對應"./*": "./*", 依Node規範解析結果不補副檔名,
 * 故打包工具須具備[深層子路徑補.js重試]之解析能力(webpack內建此行為; rollup需由w-package-tools之rollupFile提供)
 *
 * @returns {Object} 回傳echarts命名空間物件
 * @example
 *
 * import iniEcharts from 'w-echarts-vue/src/js/iniEcharts.mjs'
 *
 * let echarts = iniEcharts()
 * echarts.registerTheme('myTheme', { ... })
 *
 */
function iniEcharts() {
    return echarts
}


export default iniEcharts
