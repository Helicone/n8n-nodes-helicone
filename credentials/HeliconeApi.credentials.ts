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
			description: 'Your Helicone API key. Get it from your <a href="https://us.helicone.ai/api-keys" target="_blank">Helicone dashboard</a>. You can also add your LLM provider keys (OpenAI, Anthropic, etc.) if your prefer to BYOK <a href="https://us.helicone.ai/settings/providers" target="_blank">here</a>.',
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
