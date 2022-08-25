import {encloseWithTag} from "./util/tag";
import {encodeHtmlStr} from "./util/encode";
import {JSDOM} from "jsdom";

export const name = "parser"

export type Sentence = string | object;
export type SentenceArray = Sentence[];
export type TranslationObject = Sentence | SentenceArray;

/**
 * Decide a Sentence is translatable or not. `True` means it is translatable.
 * @param path A list of strings. For example, when 'c' in {'a':{'b':'c'}} is being filtered,
 * the path is ['a', 'b', 'c'].
 * @param sentence: The sentence that is being filtered.
 */
export type FilterFunc = (path: string[], sentence: Sentence) => boolean;
type ConvertObjFunc<I> = (sentence: I, path: string[], filter: FilterFunc, attrs?: any) => string | undefined;
type ConvertNodeFunc<I> = (ele: Element) => I;

const defaultFilter: FilterFunc = () => true

/**
 * Convert an object to pseudo HTML.
 * @param obj The object to convert. String, array, object are supported.
 * @param filter Filter function that decide a Sentence is translatable or not. `True` means it is translatable.
 */
export const fromObject = (obj: TranslationObject, filter: FilterFunc = defaultFilter): string => {
    // deal with single string
    if (typeof obj === 'string') {
        return obj
    } else {
        let result = fromObjectController(obj, [], filter)
        return result ? encloseWithTag('body', result) : ""
    }

}

/**
 * Convert a sentence to pseudo HTML Element. Return undefined if the sentence is not translatable.
 * @param sentence A sentence to convert.
 * @param filter Filter function that decide a Sentence is translatable or not. `True` means it is translatable.
 * @param path Current path array.
 * @param attrs html attributes
 */
const fromObjectController: ConvertObjFunc<TranslationObject> = (sentence, path, filter, attrs: any = undefined): string | undefined => {
    // exclude undefined

    if (typeof sentence === 'undefined') {
        return undefined
    }
    if (!filter(path, sentence)) {
        return undefined
    }


    switch (typeof sentence) {
        case 'string':
            return fromStr(sentence, path, filter, attrs)
        case 'object':
            // Check object is array or not.
            if (Array.isArray(sentence)) {
                return fromArr(sentence, path, filter, attrs)
            } else {
                return fromObj(sentence, path, filter, attrs)
            }
        // Exclude boolean, number, symbol, function, and bigint.
        default:
            return undefined
    }

}

const fromStr: ConvertObjFunc<string> = (str, path, filter, attrs) => {
    if (!str)
        return ""
    if (attrs && Object.keys(attrs).length > 0) {
        return encloseWithTag('p', encodeHtmlStr(str), attrs)
    } else {
        return encodeHtmlStr(str)
    }
}

const fromObj: ConvertObjFunc<any> = (obj, path, filter, attrs) => {

    if (!obj)
        return ""

    let result: string = ""
    let keys = Object.keys(obj)
    for (let key of keys) {
        let value = obj[key]
        let newPath = [...path, key]
        let newResult = fromObjectController(value, newPath, filter, {key: key})
        if (!!newResult) {
            result += newResult
        }
    }
    return encloseWithTag('div', result, attrs)
}

const fromArr: ConvertObjFunc<SentenceArray> = (arr, path, filter, attrs): string => {

    let result: string = arr
        .map((s) => {
            let parsedSentence = fromObjectController(s, path, filter);
            if (parsedSentence) {
                return encloseWithTag(
                    'li',
                    parsedSentence,
                )
            } else {
                return ""
            }
        }).join("")

    return encloseWithTag("ol", result, attrs)
}


export const toObject = (pseudoHTML: string): TranslationObject => {
    if (!pseudoHTML.startsWith("<body>") || !pseudoHTML.endsWith("</body>"))
        return pseudoHTML

    const dom = new JSDOM(pseudoHTML)
    return toObjController(dom.window.document.body) ?? ""
}

const toObjController: ConvertNodeFunc<TranslationObject> = (ele): TranslationObject => {

    switch (ele.nodeName) {
        case 'BODY':
            let childEle = ele.firstElementChild
            if (childEle)
                return toObjController(childEle)
            else
                return ele.textContent ?? ""
        case 'DIV':
            return divToObj(ele)
        case 'OL':
            return olToObj(ele)
        case 'LI':
            return liToObj(ele)
        case 'P':
            return pToObj(ele)
        default:
            throw new Error(`Unsupported node: ${ele.nodeName}`)
    }
}

const divToObj: ConvertNodeFunc<any> = (ele) => {
    let result: any = {}
    for (let child of ele.children) {
        if (child.id) {
            result[child.id] = toObjController(child)
        } else {
            throw new Error(`Id of node not found: ${child.nodeName}: ${child.outerHTML}`)
        }
    }
    return result
}

const olToObj: ConvertNodeFunc<SentenceArray> = (ele) => {
    let result: SentenceArray = []
    for (let child of ele.children) {
        result.push(toObjController(child))
    }
    return result
}

const liToObj: ConvertNodeFunc<Sentence> = (ele) => {
    let childEle = ele.firstElementChild
    if (childEle)
        return toObjController(childEle)
    else
        return ele.textContent ?? ""
}

const pToObj: ConvertNodeFunc<string> = (ele: Node) => {
    return ele.textContent ?? ""
}
