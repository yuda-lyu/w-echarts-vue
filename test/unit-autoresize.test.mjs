import assert from 'assert'
import getContainerSize from '../src/js/getContainerSize.mjs'
import parseAutoresize from '../src/js/parseAutoresize.mjs'
import isPropUnchanged from '../src/js/isPropUnchanged.mjs'


describe('getContainerSize', function() {

    //getComputedStyle以元素之__style模擬(node無DOM)
    let winOld
    before(function() {
        winOld = global.window
        global.window = { getComputedStyle: (el) => el.__style || {} }
    })
    after(function() {
        global.window = winOld
    })
    let mk = (clientWidth, clientHeight, style) => ({ clientWidth, clientHeight, __style: style })

    it('clientWidth/clientHeight扣除padding, 與echarts量測方式相同', function() {
        assert.deepStrictEqual(getContainerSize(mk(1000, 300, { paddingLeft: '20px', paddingRight: '20px', paddingTop: '10px', paddingBottom: '0px' })), { width: 960, height: 290 })
    })

    it('padding為小數時以parseInt取整(同zrender之parseInt10), 使比較基準與圖表getWidth()一致', function() {
        assert.deepStrictEqual(getContainerSize(mk(1000, 300, { paddingLeft: '20.7px', paddingRight: '20.7px', paddingTop: '0px', paddingBottom: '0px' })), { width: 960, height: 300 })
    })

    it('無padding或padding非數字時視為0', function() {
        assert.deepStrictEqual(getContainerSize(mk(800, 400, {})), { width: 800, height: 400 })
        assert.deepStrictEqual(getContainerSize(mk(800, 400, { paddingLeft: 'auto' })), { width: 800, height: 400 })
    })

    it('padding大於clientWidth時為0, 不回傳負數(隱藏或未掛載時clientWidth亦為0)', function() {
        assert.deepStrictEqual(getContainerSize(mk(30, 0, { paddingLeft: '20px', paddingRight: '20px' })), { width: 0, height: 0 })
    })

})


describe('parseAutoresize', function() {

    it('true為啟用, 節流預設100, 無onResize', function() {
        assert.deepStrictEqual(parseAutoresize(true), { enabled: true, throttle: 100, onResize: null })
    })

    it('false、null、undefined為停用', function() {
        assert.strictEqual(parseAutoresize(false).enabled, false)
        assert.strictEqual(parseAutoresize(null).enabled, false)
        assert.strictEqual(parseAutoresize(undefined).enabled, false)
    })

    it('物件為啟用, 取其throttle與onResize', function() {
        let fn = () => {}
        assert.deepStrictEqual(parseAutoresize({ throttle: 50, onResize: fn }), { enabled: true, throttle: 50, onResize: fn })
        assert.deepStrictEqual(parseAutoresize({}), { enabled: true, throttle: 100, onResize: null })
    })

    it('throttle為0時保留0(不節流)', function() {
        assert.strictEqual(parseAutoresize({ throttle: 0 }).throttle, 0)
    })

    it('throttle取整(偵測器之throttle須為正整數), 負數為0(不節流)', function() {
        assert.strictEqual(parseAutoresize({ throttle: 50.4 }).throttle, 50)
        assert.strictEqual(parseAutoresize({ throttle: 50.5 }).throttle, 51)
        assert.strictEqual(parseAutoresize({ throttle: -5 }).throttle, 0)
    })

    it('陣列等非純物件不作為設定物件, 視同true', function() {
        assert.deepStrictEqual(parseAutoresize([]), { enabled: true, throttle: 100, onResize: null })
    })

    it('throttle非有限數字時使用預設100', function() {
        assert.strictEqual(parseAutoresize({ throttle: NaN }).throttle, 100)
        assert.strictEqual(parseAutoresize({ throttle: Infinity }).throttle, 100)
        assert.strictEqual(parseAutoresize({ throttle: '50' }).throttle, 100)
    })

    it('onResize非函數時為null', function() {
        assert.strictEqual(parseAutoresize({ onResize: 'x' }).onResize, null)
    })

    it('模板物件字面值每次重繪皆為新物件且onResize可為新函數, 其啟用狀態與節流仍相同(watcher據此不重綁)', function() {
        let a = parseAutoresize({ throttle: 100, onResize: () => {} })
        let b = parseAutoresize({ throttle: 100, onResize: () => {} })
        assert.strictEqual(a.enabled, b.enabled)
        assert.strictEqual(a.throttle, b.throttle)
        assert.notStrictEqual(a.onResize, b.onResize)
    })

    it('true與未給throttle之物件, 啟用狀態與節流相同(切換兩者不需重綁)', function() {
        let a = parseAutoresize(true)
        let b = parseAutoresize({ onResize: () => {} })
        assert.strictEqual(a.enabled, b.enabled)
        assert.strictEqual(a.throttle, b.throttle)
    })

})


describe('isPropUnchanged', function() {

    it('內容相同之不同物件(模板物件字面值)視為未變更', function() {
        assert.strictEqual(isPropUnchanged({ renderer: 'svg' }, { renderer: 'svg' }), true)
    })

    it('內容相同之巢狀物件與陣列視為未變更(例如theme之color陣列)', function() {
        assert.strictEqual(isPropUnchanged({ color: ['#c23531', '#2f4554'] }, { color: ['#c23531', '#2f4554'] }), true)
    })

    it('同一物件參照視為已變更(deep watcher偵測到物件內部異動)', function() {
        let o = { renderer: 'svg' }
        assert.strictEqual(isPropUnchanged(o, o), false)
    })

    it('內容不同之物件視為已變更', function() {
        assert.strictEqual(isPropUnchanged({ renderer: 'svg' }, { renderer: 'canvas' }), false)
        assert.strictEqual(isPropUnchanged({ color: ['#c23531'] }, { color: ['#2f4554'] }), false)
    })

    it('原始值相同視為未變更, 不同視為已變更', function() {
        assert.strictEqual(isPropUnchanged('dark', 'dark'), true)
        assert.strictEqual(isPropUnchanged('dark', ''), false)
    })

    it('物件與原始值、null之間視為已變更', function() {
        assert.strictEqual(isPropUnchanged({ color: [] }, 'dark'), false)
        assert.strictEqual(isPropUnchanged(null, {}), false)
        assert.strictEqual(isPropUnchanged({}, null), false)
    })

})
