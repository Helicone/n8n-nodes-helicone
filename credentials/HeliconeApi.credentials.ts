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
 			description: 'Your Helicone API key. Get it from <a href="https://us.helicone.ai/developer" target="_blank">Helicone API Keys</a>. Add your LLM provider keys (OpenAI, Anthropic, etc.) at <a href="https://us.helicone.ai/settings/provider-keys" target="_blank">Provider Keys</a>.',
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
