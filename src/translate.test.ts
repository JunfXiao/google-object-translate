import dotenv from 'dotenv';
import {ObjectTranslate} from './translate';

dotenv.config();

if (!process.env.G_TRANSLATE_API_KEY) {
    console.warn('G_TRANSLATE_API_KEY is not set, skipping tests for `translate.ts`');
    test('skip', () => {
    });
} else {
    const client = ObjectTranslate.createClient('v2', {
        key: process.env.G_TRANSLATE_API_KEY
    })

    test('translate: v2 - single string', async () => {
        const result = await client.translate("Hello World", {
            from: 'en',
            to: 'zh-CN'
        })
        expect(result[0]).toBe('你好世界')
    })

    test('translate: v2 - single object', async () => {

        const result = await client.translate(
            {
                "title": "Hello World",
                "viewerNumber": 1,
                "content": "World"
            },
            {
                from: 'en',
                to: 'zh-CN'
            })
        expect(result[0]).toEqual({
            "title": "你好世界",
            "content": "世界",
        })
    })

    test('translate: v2 - single list', async () => {

        const result = await client.translate(
            [
                "Hello World",
                "World",
                123,
                "Hello"
            ],
            {
                from: 'en',
                to: 'zh-CN'
            })
        expect(result[0]).toEqual([
            "你好世界",
            "世界",
            "你好"
        ])
    })
}


