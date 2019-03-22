import { getTypeId } from './TypeIdUtils';
import { getShortName } from '.';

/**
 * 格式化出入参
 * @param {*} str 参数
 * retrun [kType, vType];
 */
export function formatKV(str: string) {
    const strArr = str.split(',');
    let kType = null;
    let i = 0;
    while (i < strArr.length) {
        kType = strArr.slice(0, ++i).join('');
        if (kType.split('>').length === kType.split('<').length) {
            break;
        }
    }
    const vType = strArr.slice(i).join('');

    return [parseType(kType), parseType(vType)];
}

const typeReg = /^([^<>]+)<(.+)>$/;
/**
 * 格式化Type
 * @param str 格式
 * return { name, shortName, typeId, childType? }
 */
export const parseType = (str: string) => {
    const newStr: string = str.replace(/(^\s*)|(\s*$)/g, '');

    if (newStr.slice(-2) === '[]') {
        return {
            name: 'java.lang.reflect.Array',
            typeId: 23,
            shortName: getShortName(str),
            childType: [parseType(newStr.slice(0, -2))],
        };
    }

    const typeRegResult = str.match(typeReg);
    if (typeRegResult) {
        const [, pType, cType] = typeRegResult;
        if (getTypeId(pType) === 24) {
            return {
                name: pType,
                typeId: getTypeId(pType),
                shortName: getShortName(str),
                childType: formatKV(cType),
            };
        }

        return {
            name: pType,
            typeId: getTypeId(pType),
            shortName: getShortName(str),
            childType: [parseType(cType)],
        };
    }

    return {
        name: str,
        typeId: getTypeId(str),
        shortName: getShortName(str),
    };
};
