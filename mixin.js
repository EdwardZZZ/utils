function isObject(val) {
    return typeof val === 'function' || (typeof val === 'object' && val !== null && !Array.isArray(val));
}

function cloneArray(arr) {
    const newArr = arr.map((v) => {
        if (Array.isArray(v)) {
            return cloneArray(arr);
        } else if (isObject(v)) {
            return mixin({}, v);
        } else {
            return v;
        }
    });
    return newArr;
}

function mixin(target, ...rest) {
    for (let obj of rest) {
        if (!isObject(obj)) continue;
        for (let key in obj) {
            if (key === '__proto__') continue
            const targetVal = target[key];
            const val = obj[key];
            if (Array.isArray(val)) {
                target[key] = cloneArray(val);
            } else if (isObject(val) && isObject(targetVal)) {
                mixin(targetVal, val);
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

console.log(mixin({}, a, b));
