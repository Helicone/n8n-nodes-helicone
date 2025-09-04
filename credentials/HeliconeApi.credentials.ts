import type {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class HeliconeApi implements ICredentialType {
	name = 'heliconeApi';

	displayName = 'Helicone LLM Observability';

	documentationUrl = 'https://docs.helicone.ai/getting-started/quick-start';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Your Helicone API key (starts with pk- for write access or sk- for read access). You can get your API key from your <a href="https://helicone.ai/dashboard" target="_blank">Helicone Dashboard</a>.',
			required: true
		}
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
