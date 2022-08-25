import {decodeHtmlStr, encodeHtmlStr} from "./encode";

export const encloseWithTag = (tag: string, content: string, attrs: any = {}): string => {
    let attrText = "";
    let keys = Object.keys(attrs);

    if (keys.includes('key')) {
        let id = attrs['key']
        attrText += ` id="${encodeHtmlStr(id)}"`
        keys = keys.filter(k => k != "key")
    }

    if (keys.length > 0) {
        let encodedKeys = keys.map(key => encodeHtmlStr(key)).join('>');
        let encodedValues = keys.map(key => encodeHtmlStr(attrs[key])).join('>');
        attrText += ` data-k="${encodedKeys}" data-v="${encodedValues}"`;
    }

    return `<${tag}${attrText}>${content}</${tag}>`;
}

export const readTagAttrs = (keys: string, values: string) => {
    let attrs: any = {};
    let keyArray = keys.split('>');
    let valueArray = values.split('>');
    for (let i = 0; i < keyArray.length; i++) {
        attrs[decodeHtmlStr(keyArray[i])] = decodeHtmlStr(valueArray[i]);
    }
    return attrs;
}