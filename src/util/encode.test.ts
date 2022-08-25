import {decodeHtmlStr, encodeHtmlStr} from "./encode";

test("encodeHtmlStr", () => {
    expect(encodeHtmlStr("<>&\"\'")).toBe("&lt;&gt;&amp;&quot;&#39;")
})

test("decodeHtmlStr", () => {
    expect(decodeHtmlStr("&lt;&gt;&amp;&quot;&#39;")).toBe("<>&\"\'")
})

test("encodeHtmlStr and decodeHtmlStr", () => {
    let testStr = "<>&\"\'"
    expect(decodeHtmlStr(encodeHtmlStr(testStr))).toBe(testStr)
})

test("dual encode test", () => {
    let testStr = "<>&\"\'"
    testStr = encodeHtmlStr(testStr)
    expect(decodeHtmlStr(encodeHtmlStr(testStr))).toBe(testStr)
})