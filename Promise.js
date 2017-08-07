export default class Promise {
    constructor(fn) {
        if (!fn) throw new TypeError('Promise resolver undefined is not a function');

        const resolve = (newValue) => {
            if (newValue instanceof Promise) {
                newValue.then(resolve);
                return;
            }
            this.status = 'fulfilled';
            this.value = newValue;
            finale();
        }

        const reject = (reason) => {
            this.status = 'rejected';
            this.value = reason;
            finale();
        }

        const finale = () => {
            setTimeout(t => this.handle(this.deferred), 0);
        }

        fn(resolve, reject);
    }

    status = 'pending';
    value = void 0;
    deferred = null;

    static resolve = (d) => new Promise(resolve => resolve(d));
    static reject = (d) => new Promise((resolve, reject) => reject(d));
    static all = (promises) => new Promise((resolve, reject) => {
        let results = [],
            n = 0;
        promises.forEach((promise, i) => {
            promise.then(data => {
                results[i] = data;
                if (++n === promises.length) {
                    resolve(results);
                }
            });
        });
    });

    handle = (deferred) => {
        let { status, value } = this;

        if (status === 'pending') {
            this.deferred = deferred;
            return;
        }

        if (!deferred) {
            if (status === 'rejected') {
                console.error(value);
            }
            return;
        }

        let cb = status === 'fulfilled' ? deferred.done : deferred.fail;
        if (cb === null) {
            cb = status === 'fulfilled' ? deferred.resolve : deferred.reject;
            cb && cb(value);
            return;
        }

        try {
            const ret = cb(value);
            deferred.resolve && deferred.resolve(ret);
        } catch (e) {
            deferred.reject && deferred.reject(e);
        }
    }

    then(done, fail) {
        return new Promise((resolve, reject) => {
            this.handle({
                done: done || null,
                fail: fail || null,
                resolve: resolve,
                reject: reject
            });
        });
    }

    catch (fail) {
        return new Promise((resolve, reject) => {
            this.handle({
                done: null,
                fail: fail || null,
                reject: reject
            });
        });
    }
}
