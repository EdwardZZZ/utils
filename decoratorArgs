export default function (...args) {
    if (args.length === 3 && typeof args[2].value === 'function') {
        return handle(...args);
    } else {
        return function () {
            return handle(...arguments, args);
        };
    }
}

function bind(fn, context) {
    if (fn.bind) {
        return fn.bind(context);
    } else {
        return function __autobind__() {
            return fn.apply(context, arguments);
        };
    }
}

function handle(target, key, { value: _fn, configurable, enumerable }, _args) {
    return {
        configurable,
        enumerable,

        get() {
            let fn = function(){
                console.log(_args)
                _fn.bind(this)();
            }

            const boundFn = bind(fn, this);

            Object.defineProperty(this, key, {
                configurable: true,
                writable: true,
                // NOT enumerable when it's a bound method
                enumerable: false,
                value: boundFn
            });

            return boundFn;
        },
    };
}
