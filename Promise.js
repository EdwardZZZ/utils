const PENDDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

const _handle = Symbol('handle');
const _deferred = Symbol('deferred');

export default class Promise {
    constructor(fn) {
        if (!fn) {
            throw new TypeError("Promise resolver undefined is not a function");
        }

        const resolve = newValue => {
            if (newValue instanceof Promise) {
                if (newValue.status === REJECTED) {
                    newValue.catch(reject);
                } else {
                    newValue.then(resolve);
                }
                return;
            }
            this.status = FULFILLED;
            this.value = newValue;
            finale();
        };

        const reject = reason => {
            this.status = REJECTED;
            this.value = reason;
            finale();
        };

        const finale = () => {
            // setImmediate 为macroTask，此处应该用microTask实现
            // web用MutationObserver，node端用process.nextTick
            setImmediate(t => this[_handle](this[_deferred]));
        };

        fn(resolve, reject);
    }

    status = PENDDING;
    value = void 0;

    [_deferred] = null;
    [_handle] = deferred => {
        let { status, value } = this;

        if (status === PENDDING) {
            this[_deferred] = deferred;
            return;
        }

        if (!deferred) return;

        const { didFulfill, didReject, resolve, reject } = deferred;
        let callback = status === FULFILLED ? didFulfill : didReject;
        if (callback === null) {
            callback = status === FULFILLED ? resolve : reject;
            callback && callback(value);
            return;
        }

        try {
            const ret = callback(value);
            resolve && resolve(ret);
        } catch (e) {
            reject && reject(e);
        }
    };

    then(didFulfill = null, didReject = null) {
        return new Promise((resolve, reject) => {
            this[_handle]({ didFulfill, didReject, resolve, reject });
        });
    }

    catch(didReject = null) {
        return new Promise((resolve, reject) => {
            this[_handle]({ didFulfill: null, didReject, resolve, reject });
        });
    }

    static resolve = d => new Promise(resolve => resolve(d));
    static reject = d => new Promise((resolve, reject) => reject(d));
    static all = promises => new Promise((resolve, reject) => {
        const results = [];
        let n = 0;
        promises.forEach((promise, i) => {
            promise.then(data => {
                results[i] = data;
                if (++n === promises.length) {
                    resolve(results);
                }
            }, e => {
                reject(e);
            });
        });
    });
}
