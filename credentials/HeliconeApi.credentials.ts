import {
	IAuthenticateGeneric,
	ICredentialDataDecryptedObject,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class HeliconeApi implements ICredentialType {
	name = 'heliconeApi';
	displayName = 'Helicone API';
	documentationUrl = 'https://docs.helicone.ai/getting-started/quick-start';
	properties: INodeProperties[] = [
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

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Authorization': '=Bearer {{$credentials.apiKey}}',
				'Content-Type': 'application/json',
			},
		},
	};
}