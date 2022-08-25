const escapeCharacters = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '\"': '&quot;',
    "\'": '&#39;',
}


type EscapeCharacter = keyof typeof escapeCharacters
export const encodeHtmlStr = (str: string): string => {
    return str.replace(/[\n\r<>&"']/g, (match) =>
        Object.keys(escapeCharacters).includes(match) ? escapeCharacters[match as EscapeCharacter] : match
    )
}

export const decodeHtmlStr = (str: string): string => {
    return str.replace(/(&#?[a-zA-Z0-9]+;)/g, (match, dec) => {
            let idx = Object.keys(escapeCharacters).findIndex(key => escapeCharacters[key as EscapeCharacter] === dec)
            return idx !== -1 ? Object.keys(escapeCharacters)[idx] : match
        }
    );
}