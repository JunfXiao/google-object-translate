# `google-object-translate`

A module that parse object to pseudo HTML to translate and parse it back.

The core concept of this module is that google can translate any html while keeping its structure. Therefore, we can
parse the pseudo HTML to translate and parse it back.

## Installation

```bash
npm install google-object-translate
```

To use `google-object-translate/translate` module, package `@google-cloud/translate` is also required:

```bash
npm install @google-cloud/translate
```

## Usage

### Use build-in translate function

```typescript
import {translate} from 'google-object-translate';

const client = translate.ObjectTranslate.createClient('v2', {
    // your google-cloud config here
    // See: https://cloud.google.com/nodejs/docs/reference/translate/latest/translate/v2.translateconfig
})

const objToTranslate = {
    "title": "Hello World",
    "viewerNumber": 1,
    "content": "World"
}

const result = await client.translate(
    objToTranslate,
    // See: https://cloud.google.com/nodejs/docs/reference/translate/latest/translate/v2.translaterequest
    {
        from: 'en',
        to: 'zh-CN',

    })
// result = {
//     "title":"你好世界",
//     "content":"世界",
// }
```

### Use custom translate function

```typescript
import {parser} from 'google-object-translate';
```

#### `parser.fromObject` : Parse object to pseudo HTML

##### Arguments:

| Name     | Type                                              | Required | Default  | Comment                                                      |
| -------- | ------------------------------------------------- | -------- | -------- | ------------------------------------------------------------ |
| `obj`    | `TranslationObject`                               | true     | -        | The object to translate                                      |
| `filter` | `(path: string[], sentence: Sentence) => boolean` | false    | ()=>true | Filter function that decide a Sentence is translatable or not. `True` means it is translatable. |

##### Return Type: `string`

#### `parser.toObject` : Parse pseudo HTML back to object

##### Arguments:

| Name         | Type     | Required | Default | Comment |
| ------------ | -------- | -------- | ------- | ------- |
| `pseudoHTML` | `string` | true     | -       | -       |

##### Return Type: `TranslationObject`

## Todo

- [ ] Support v3 and v3-beta API in `translate.ts`

## Types

| Type              | Alias for                 |
| ----------------- | ------------------------- |
| Sentence          | string \| object          |
| SentenceArray     | Sentence[]                |
| TranslationObject | Sentence \| SentenceArray |

## Conversion Rules

### Some values are skipped

Some values will not be converted to pseudo HTML because it's meaningless. This includes:

- Number
- Boolean
- Empty String
- null
- undefined

### string

before:

```typescript
"some str"
```

after:

```html
some str
```

### Array

before:

```typescript
["item 1", 123, true, "item 2"]
```

after:

```html
<body>
<ol>
    <li>item 1</li>
    <li>item 2</li>
</ol>
</body>
```

### Object

before:

```json
{
  "a": "",
  "b": [
    "item1",
    2,
    true
  ],
  "c": null,
  "d": {
    "d1": "d1v",
    "d2": "d2v"
  }
}
```

after:

```html
<body>
<div>
    <ol id="b">
        <li>item1</li>
    </ol>
    <div id="d">
        <p id="d1">d1v</p>
        <p id="d2">d2v</p>
    </div>
</div>
</body>
```

