let _args;

export default function (args) {
    if(args.before && args.after){
        _args = args;
        return AutobindProperty;
    }else{
        AutobindProperty(args);
    }
}

function AutobindProperty(args){
    if (args.length === 3 && typeof args[2].value === 'function') {
        return handle(...args);
    } else {
        return function () {
            return handle(...arguments, _args);
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

function handle(target, key, { value: _fn, configurable, enumerable }, { before, after } = { before, after }) {
    return {
        configurable,
        enumerable,

        get() {
            let fn = function () {
                before && before();
                _fn.bind(this)(...arguments);
                after && after();
            }

            const boundFn = bind(fn, this);

            Object.defineProperty(this, key, {
                configurable: true,
                writable: true,
                enumerable: false,
                value: boundFn
            });

            return boundFn;
        },
    };
}
