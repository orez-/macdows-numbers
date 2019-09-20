
let wasm;

let cachedTextDecoder = new TextDecoder('utf-8');

let cachegetUint8Memory = null;
function getUint8Memory() {
    if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory;
}

function getStringFromWasm(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
}

const heap = new Array(32);

heap.fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }
/**
*/
export const Player = Object.freeze({ None:0,Blue:1,Red:2, });
/**
*/
export const MoveState = Object.freeze({ Success:0,Invalid:1,RowWin:2,GameOver:3, });
/**
*/
export class Board {

    static __wrap(ptr) {
        const obj = Object.create(Board.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_board_free(ptr);
    }
    /**
    * @returns {Board}
    */
    static new() {
        const ret = wasm.board_new();
        return Board.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    player_turn() {
        const ret = wasm.board_player_turn(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    left_num() {
        const ret = wasm.board_left_num(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    right_num() {
        const ret = wasm.board_right_num(this.ptr);
        return ret;
    }
    /**
    * @param {number} value
    * @returns {MoveResult}
    */
    set_left(value) {
        const ret = wasm.board_set_left(this.ptr, value);
        return MoveResult.__wrap(ret);
    }
    /**
    * @param {number} value
    * @returns {MoveResult}
    */
    set_right(value) {
        const ret = wasm.board_set_right(this.ptr, value);
        return MoveResult.__wrap(ret);
    }
}
/**
*/
export class MoveResult {

    static __wrap(ptr) {
        const obj = Object.create(MoveResult.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_moveresult_free(ptr);
    }
    /**
    * @returns {number}
    */
    get index() {
        const ret = wasm.__wbg_get_moveresult_index(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set index(arg0) {
        wasm.__wbg_set_moveresult_index(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get state() {
        const ret = wasm.__wbg_get_moveresult_state(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set state(arg0) {
        wasm.__wbg_set_moveresult_state(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get win0() {
        const ret = wasm.__wbg_get_moveresult_win0(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set win0(arg0) {
        wasm.__wbg_set_moveresult_win0(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get win1() {
        const ret = wasm.__wbg_get_moveresult_win1(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set win1(arg0) {
        wasm.__wbg_set_moveresult_win1(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get win2() {
        const ret = wasm.__wbg_get_moveresult_win2(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set win2(arg0) {
        wasm.__wbg_set_moveresult_win2(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get win3() {
        const ret = wasm.__wbg_get_moveresult_win3(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set win3(arg0) {
        wasm.__wbg_set_moveresult_win3(this.ptr, arg0);
    }
}

function init(module) {
    if (typeof module === 'undefined') {
        module = import.meta.url.replace(/\.js$/, '_bg.wasm');
    }
    let result;
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__widl_f_log_1_ = function(arg0) {
        console.log(getObject(arg0));
    };
    imports.wbg.__wbg_random_09364f2d8647f133 = typeof Math.random == 'function' ? Math.random : notDefined('Math.random');
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm(arg0, arg1));
    };

    if ((typeof URL === 'function' && module instanceof URL) || typeof module === 'string' || (typeof Request === 'function' && module instanceof Request)) {

        const response = fetch(module);
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            result = WebAssembly.instantiateStreaming(response, imports)
            .catch(e => {
                return response
                .then(r => {
                    if (r.headers.get('Content-Type') != 'application/wasm') {
                        console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
                        return r.arrayBuffer();
                    } else {
                        throw e;
                    }
                })
                .then(bytes => WebAssembly.instantiate(bytes, imports));
            });
        } else {
            result = response
            .then(r => r.arrayBuffer())
            .then(bytes => WebAssembly.instantiate(bytes, imports));
        }
    } else {

        result = WebAssembly.instantiate(module, imports)
        .then(result => {
            if (result instanceof WebAssembly.Instance) {
                return { instance: result, module };
            } else {
                return result;
            }
        });
    }
    return result.then(({instance, module}) => {
        wasm = instance.exports;
        init.__wbindgen_wasm_module = module;

        return wasm;
    });
}

export default init;

