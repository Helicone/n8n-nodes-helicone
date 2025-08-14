"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeliconeApi = void 0;
class HeliconeApi {
    constructor() {
        this.name = 'heliconeApi';
        this.displayName = 'Helicone API';
        this.documentationUrl = 'https://docs.helicone.ai/getting-started/quick-start';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                description: 'Your Helicone API key (starts with pk- for write access or sk- for read access)',
                required: true,
            },
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: 'https://api.helicone.ai',
                description: 'The base URL for Helicone API. Use https://api.eu.helicone.ai for EU customers.',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'Authorization': '=Bearer {{$credentials.apiKey}}',
                    'Content-Type': 'application/json',
                },
            },
        };
    }
}
exports.HeliconeApi = HeliconeApi;
