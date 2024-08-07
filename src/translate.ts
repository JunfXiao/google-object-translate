import type { TranslateRequest } from "@google-cloud/translate/build/src/v2";
import type { v2, v3, v3beta1 } from '@google-cloud/translate'
import * as parser from "./parser";
import { TranslationObject } from "./parser";

export const name = "translate"


type TranslationClients = {
    'v2': v2.Translate,
    'v3': v3.TranslationServiceClient,
    'v3beta1': v3beta1.TranslationServiceClient
}


type TranslationClientOptions = {
    'v2': ConstructorParameters<typeof v2.Translate>[0],
    'v3': ConstructorParameters<typeof v3.TranslationServiceClient>[0],
    'v3beta1': ConstructorParameters<typeof v3beta1.TranslationServiceClient>[0]
}


type TranslationResult = [TranslationObject, any]


export class ObjectTranslate<T extends keyof TranslationClientOptions, TOpt = any> {
    // protected options: TranslationClientOptions[T] | undefined
    protected client: TranslationClients[T]
    protected translationType: T

    protected constructor(version: T, client: TranslationClients[T]) {
        this.translationType = version
        this.client = client
        // this.options = options
    }

    static createClient<V extends keyof TranslationClients>(version: V, options?: TranslationClientOptions[V]): ObjectTranslate<keyof TranslationClients> {
        try {
            let googleTranslate = require('@google-cloud/translate')
            switch (version) {
                case 'v2':
                    return new ObjectTranslateV2(new googleTranslate.v2.Translate(options))
                case 'v3':
                    return new ObjectTranslateV3(new googleTranslate.v3.TranslationServiceClient(options))
                case 'v3beta1':
                    return new ObjectTranslateV3beta1(new googleTranslate.v3beta1.TranslationServiceClient(options))
                default:
                    throw new Error(`Unknown translation version: ${version}`)
            }
        } catch (e) {
            throw new Error('@google-cloud/translate is not installed or not supported. Run `npm install @google-cloud/translate`')
        }
    }

    async translate(input: TranslationObject, options?: TOpt): Promise<TranslationResult> {
        throw new Error('Not implemented')
    }
}

class ObjectTranslateV2 extends ObjectTranslate<'v2', TranslateRequest> {
    constructor(client: TranslationClients['v2']) {
        super('v2', client)
    }

    override async translate(input: TranslationObject, options: TranslateRequest): Promise<TranslationResult> {
        let rawTranslation: [string | string[], any] = await this.client.translate(parser.fromObject(input), {
            ...options,
            format: 'html'
        })
        let parsedTranslation: TranslationObject;
        if (typeof rawTranslation[0] === 'string') {
            parsedTranslation = parser.toObject(rawTranslation[0], input)
        } else if (Array.isArray(rawTranslation[0])) {
            parsedTranslation = rawTranslation[0].map(item => parser.toObject(item, input))
        } else {
            throw new Error('Unknown translation type: ' + typeof rawTranslation[0] + " " + rawTranslation[0])
        }
        return [parsedTranslation, rawTranslation[1]]
    }
}

class ObjectTranslateV3 extends ObjectTranslate<'v3'> {
    constructor(client: TranslationClients['v3']) {
        super('v3', client)
        throw new Error('Not implemented')
    }

}

class ObjectTranslateV3beta1 extends ObjectTranslate<'v3beta1'> {
    constructor(client: TranslationClients['v3beta1']) {
        super('v3beta1', client)
        throw new Error('Not implemented')
    }
}

export default ObjectTranslate