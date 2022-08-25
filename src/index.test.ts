import * as index from './index'

test('correct import', () => {
    expect(index.translate.name).toBe('translate')
    expect(index.parser.name).toBe('parser')
})