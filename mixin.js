function type(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
}

function isObject(obj) {
    return type(obj) === 'Object';
}

function cloneArray(arr) {
    return arr.map((v) => {
        if (Array.isArray(v)) {
            return cloneArray(arr);
        } else if (isObject(v)) {
            return mixin({}, v);
        } else {
            return v;
        }
    });
}

function mixin(target, ...rest) {
    for (let obj of rest) {
        if (!isObject(obj)) continue;
        for (let key in obj) {
            if (key === '__proto__') continue;
            const targetVal = target[key];
            const val = obj[key];
            if (type(val) === 'Array') {
                target[key] = cloneArray(val);
            } else if (isObject(val)) {
                target[key] = mixin(isObject(targetVal) ? targetVal : {}, val);
            } else {
                target[key] = val;
            }
        }
    }
    return target;
}

const a = {
    a: 1,
    b: {
        c: 3,
        e: [1, 2, 3],
    }
}

const b = {
    b: {
        d: 4,
        e: [4, 5]
    }
}

const newObj = mixin({}, a, b);
console.log(newObj);
b.b.e = [6];
console.log(newObj);
