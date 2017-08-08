export default function({handleMethod, handleClass}){
    const _checkMethod = (args) => {
        return args.length === 3 && args[0].constructor && typeof args[1] === 'string' && args[2].value && typeof args[2].value === 'function';
    }

    const _handleMethod = (args, ...params) => {
        return handleMethod || null;
    }

    const _handleClass = (clazz, ...params) => {
        return handleClass || clazz;
    }

    return function(...args) {
        if (_checkMethod(args)) {
            return _handleMethod(args);
        } else {
            return function(...args1) {
                if (_checkMethod(args1)) {
                    return _handleMethod(args1, ...args);
                }
                if (args1.length === 1) {
                    return function() {
                        return _handleClass(args1[0], ...args);
                    }
                }
                return _handleClass(args[0]);
            };
        }
    }
}
