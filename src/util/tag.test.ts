import * as tag from "./tag";

test('tag test - simple', () => {
    expect(tag.encloseWithTag('tag', 'content', {key: 'value'})).toBe('<tag id="value">content</tag>')
})

test('tag test - multiple attrs', () => {
    expect(
        tag.encloseWithTag(
            'tag',
            'content',
            {
                key1: 'v1',
                key2: 'v2'
            }
        )
    ).toBe('<tag data-k="key1>key2" data-v="v1>v2">content</tag>')
})

test('tag test - escape characters', () => {
    expect(
        tag.encloseWithTag(
            'tag',
            '\n\r\t',
            {
                "key1<": 'v1\n`',
                "key2>": 'v2\r'
            }
        )
    ).toBe('<tag data-k="key1&lt;>key2&gt;" data-v="v1\n`>v2\r">\n\r\t</tag>')
})