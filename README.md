# w-echarts-vue
A vue component for echarts.

![language](https://img.shields.io/badge/language-JavaScript-orange.svg) 
[![language](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://github.com/vuejs/vue) 
[![npm version](http://img.shields.io/npm/v/w-echarts-vue.svg?style=flat)](https://npmjs.org/package/w-echarts-vue) 
[![license](https://img.shields.io/npm/l/w-echarts-vue.svg?style=flat)](https://npmjs.org/package/w-echarts-vue) 
[![npm download](https://img.shields.io/npm/dt/w-echarts-vue.svg)](https://npmjs.org/package/w-echarts-vue) 
[![npm download](https://img.shields.io/npm/dm/w-echarts-vue.svg)](https://npmjs.org/package/w-echarts-vue)
[![jsdelivr download](https://img.shields.io/jsdelivr/npm/hm/w-echarts-vue.svg)](https://www.jsdelivr.com/package/npm/w-echarts-vue)

Echarts(full build) and echarts-gl(3D charts) are bundled in this package, no need to load them from cdn.

## Documentation
To view documentation or get support, visit [docs](https://yuda-lyu.github.io/w-echarts-vue/global.html).

## Example
To view some examples for more understanding, visit examples:

> **all components:** [web](//yuda-lyu.github.io/w-echarts-vue/examples/app.html) [[source code](https://github.com/yuda-lyu/w-echarts-vue/blob/master/docs/examples/app.html)]

## Installation

### Using npm(ES6 module):
```alias
npm i w-echarts-vue
```
Import component(UMD module):
```alias
//choose component
<w-echarts-vue
    ...
></w-echarts-vue>

//import
import WEchartsVue from 'w-echarts-vue'

//component
Vue.component('w-echarts-vue',WEchartsVue)
```
Import component(source code):
```alias
//choose component
<w-echarts-vue
    ...
></w-echarts-vue>

//import
import WEchartsVue from 'w-echarts-vue/src/components/WEchartsVue.vue'

//component
Vue.component('w-echarts-vue',WEchartsVue)
//or
export default {
    components: {
        WEchartsVue,
        //or
        'w-echarts-vue': WEchartsVue,
    },
    ...
}
```

### In a browser(UMD module):

Add script for vue.
```alias
<script src="https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.min.js"></script>
```

Add script for w-echarts-vue.
```alias
<script src="https://cdn.jsdelivr.net/npm/w-echarts-vue@1.0.0/dist/w-echarts-vue.umd.js"></script>
```

Directly use:
```alias
//app and component
<div id="app">
    <w-echarts-vue
        ...
    ></w-echarts-vue>
</div>

//component
Vue.component('w-echarts-vue', window['w-echarts-vue'])

//new
new Vue({
    el: '#app',
    data: {
        ...
    }
})
```

## Components

| component | tag | description |
| --- | --- | --- |
| WEchartsVue | `w-echarts-vue` | Echarts chart, use `options` for [echarts settings](https://echarts.apache.org/examples/en/index.html) |

The component has no default height, remember to give it a size:
```alias
<w-echarts-vue
    style="width:620px; height:300px;"
    :options="options"
></w-echarts-vue>
```

All echarts events(`click`, `legendselectchanged`, `datazoom`, `finished`...) are forwarded:
```alias
<w-echarts-vue
    :options="options"
    @click="ev=>{console.log('click',ev)}"
    @finished="()=>{console.log('finished')}"
></w-echarts-vue>
```

Use `getChart` for accessing the inner chart instance:
```alias
//template
<w-echarts-vue
    ref="ec"
    :options="options"
></w-echarts-vue>

//chart, an instance of echarts.ECharts, returns null before initialization
let chart = this.$refs.ec.getChart()
```
