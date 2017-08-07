export default function(...args) {
    if (checkMethod(args)) {
        return handleMethod(args);
    } else {
        return function(...args1) {
            if (checkMethod(args1)) {
                return handleMethod(args1, args);
            }
            if (args1.length === 1) {
                return function() {
                    return handleClass(args1[0], args);
                }
            }
            return handleClass(args[0]);
        };
    }
}

const checkMethod = (args) => {
    return args.length === 3 && args[2].value && typeof args[2].value === 'function'
}

function handleMethod(args, params) {
    console.log('handleMethod', args, params);
}

function handleClass(clazz, params) {
    console.log('handleClass', clazz, params);
}
