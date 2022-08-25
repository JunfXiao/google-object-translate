import * as parser from './parser'
import {TranslationObject} from './parser'


test("parser: single - string", () => {
    let result = parser.fromObject("hello")
    expect(result).toBe("hello")
})

test("parser: single - string - revert", () => {
    let result = parser.toObject("hello")
    expect(result).toBe("hello")
})


test("parser: single - list", () => {
    let result = parser.fromObject(["item 1", 2, true, "item 2"])
    expect(result).toBe("<body><ol><li>item 1</li><li>item 2</li></ol></body>")
})

test("parser: single - list - revert", () => {
    let result = parser.toObject("<body><ol><li>item1</li></ol></body>")
    expect(result).toEqual(["item1"])
})

test("parser: single - object", () => {
    let result = parser.fromObject({
        "a": undefined,
        "b": "",
        "c": null,
        "d": "dd"
    })
    expect(result).toBe(`<body><div><p id="d">dd</p></div></body>`)
})

test("parser: single - object - revert", () => {
    let result = parser.toObject(`<body><div><p id="d">dd</p></div></body>`)
    expect(result).toEqual({
        "d": "dd"
    })
})

test("parser: complicated - object", () => {
    let result = parser.fromObject({
        "a": undefined,
        "b": ["item1", 2, true],
        "c": null,
        "d": {
            "d1": "d1v",
            "d2": "d2v"
        }
    })
    expect(result).toBe(`<body><div><ol id="b"><li>item1</li></ol><div id="d"><p id="d1">d1v</p><p id="d2">d2v</p></div></div></body>`)
})

test("parser: complicated - object - revert", () => {
    let result = parser.toObject(`<body><div><ol id="b"><li>item1</li></ol><div id="d"><p id="d1">d1v</p><p id="d2">d2v</p></div></div></body>`)
    expect(result).toEqual({
        "b": ["item1"],
        "d": {
            "d1": "d1v",
            "d2": "d2v"
        }
    })
})

test("parser: complicated - nested object and list", () => {
    let testObj = {
        "a": undefined,
        "b": ["item1", 2, ['item3-1', undefined, 'item3-2'], true],
        "c": null,
        "d": {
            "d1": "d1v",
            "d2": "d2v",
            "d3": {
                "d3a": "d3a",
                "d3b": ["item1", 2, true]
            }
        }
    }
    let targetObj = {
        "b": ["item1", ['item3-1', 'item3-2']],
        "d": {
            "d1": "d1v",
            "d2": "d2v",
            "d3": {
                "d3a": "d3a",
                "d3b": ["item1"]
            }
        }
    }

    let result = parser.toObject(parser.fromObject(testObj))
    expect(result).toEqual(targetObj)
})


test("parser: filter - object", () => {
    let sample = {
        "a": ["item1", 2],
        "b": {
            "b1": "b1v",
            "b2": "b2v",
        }
    }
    let filterRecord: Set<{ path: string[], sentence: TranslationObject }> = new Set()
    parser.fromObject(sample, (path, sentence) => {
        filterRecord.add({path, sentence})
        return true
    })

    let standardRecord = new Set([
        {path: [], sentence: sample},
        {path: ["a"], sentence: sample["a"]},
        {path: ["a"], sentence: sample["a"][0]},
        {path: ["a"], sentence: sample["a"][1]},
        {path: ["b"], sentence: sample["b"]},
        {path: ["b", "b1"], sentence: sample["b"]["b1"]},
        {path: ["b", "b2"], sentence: sample["b"]["b2"]}
    ])

    expect(filterRecord).toEqual(standardRecord)

})