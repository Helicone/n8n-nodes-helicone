import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	NodeOperationError,
	IHttpRequestOptions,
  NodeConnectionType,
  INodeOutputConfiguration,
  INodeInputConfiguration,
} from 'n8n-workflow';

export class Helicone implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Helicone',
		name: 'helicone',
		icon: 'file:helicone.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["provider"] + " LLM Request"}}',
		description: 'Make LLM requests through Helicone proxy for observability',
		defaults: {
			name: 'Helicone',
		},
		inputs: ['main'] as (NodeConnectionType | INodeInputConfiguration)[],
		outputs: ['main'] as (NodeConnectionType | INodeOutputConfiguration)[],
		credentials: [
			{
				name: 'heliconeApi',
				required: true,
			},
		],
		properties: [
			// LLM Provider Selection
			{
				displayName: 'LLM Provider',
				name: 'provider',
				type: 'options',
				options: [
					{
						name: 'OpenAI',
						value: 'openai',
					},
					{
						name: 'Anthropic',
						value: 'anthropic',
					},
					{
						name: 'Azure OpenAI',
						value: 'azure',
					},
				],
				default: 'openai',
				description: 'The LLM provider to use',
			},

			// OpenAI Configuration
			{
				displayName: 'OpenAI API Key',
				name: 'openaiApiKey',
				type: 'string',
				typeOptions: {
					password: true,
				},
				displayOptions: {
					show: {
						provider: ['openai'],
					},
				},
				default: '',
				description: 'Your OpenAI API key',
				required: true,
			},

			{
				displayName: 'Model',
				name: 'openaiModel',
				type: 'string',
				displayOptions: {
					show: {
						provider: ['openai'],
					},
				},
				default: 'gpt-4o-mini',
				description: 'The OpenAI model to use',
				required: true,
			},

			// Anthropic Configuration
			{
				displayName: 'Anthropic API Key',
				name: 'anthropicApiKey',
				type: 'string',
				typeOptions: {
					password: true,
				},
				displayOptions: {
					show: {
						provider: ['anthropic'],
					},
				},
				default: '',
				description: 'Your Anthropic API key',
				required: true,
			},

			{
				displayName: 'Model',
				name: 'anthropicModel',
				type: 'string',
				displayOptions: {
					show: {
						provider: ['anthropic'],
					},
				},
				default: 'claude-3-opus-20240229',
				description: 'The Anthropic model to use',
				required: true,
			},

			// Azure OpenAI Configuration
			{
				displayName: 'Azure API Key',
				name: 'azureApiKey',
				type: 'string',
				typeOptions: {
					password: true,
				},
				displayOptions: {
					show: {
						provider: ['azure'],
					},
				},
				default: '',
				description: 'Your Azure OpenAI API key',
				required: true,
			},

			{
				displayName: 'Azure Domain',
				name: 'azureDomain',
				type: 'string',
				displayOptions: {
					show: {
						provider: ['azure'],
					},
				},
				default: '',
				description: 'Your Azure OpenAI domain (without https://, e.g., myresource.openai.azure.com)',
				required: true,
			},

			{
				displayName: 'Deployment Name',
				name: 'azureDeploymentName',
				type: 'string',
				displayOptions: {
					show: {
						provider: ['azure'],
					},
				},
				default: '',
				description: 'Your Azure OpenAI deployment name',
				required: true,
			},

			{
				displayName: 'API Version',
				name: 'azureApiVersion',
				type: 'string',
				displayOptions: {
					show: {
						provider: ['azure'],
					},
				},
				default: '2023-12-01-preview',
				description: 'The Azure OpenAI API version to use',
				required: true,
			},

			// Common LLM Parameters
			{
				displayName: 'Messages',
				name: 'messages',
				type: 'json',
				default: '[{"role": "user", "content": "Hello!"}]',
				description: 'The messages to send to the LLM (JSON array format)',
				required: true,
			},

			{
				displayName: 'System Message',
				name: 'systemMessage',
				type: 'string',
				displayOptions: {
					show: {
						provider: ['anthropic'],
					},
				},
				default: '',
				description: 'System message for Anthropic (optional)',
			},

			{
				displayName: 'Max Tokens',
				name: 'maxTokens',
				type: 'number',
				default: 100,
				description: 'Maximum number of tokens to generate',
			},

			{
				displayName: 'Temperature',
				name: 'temperature',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 2,
					numberStepSize: 0.1,
				},
				default: 1,
				description: 'Sampling temperature (0-2)',
			},

			// Helicone Features
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Custom Properties',
						name: 'customProperties',
						type: 'json',
						default: '{}',
						description: 'Custom properties to add to the request (JSON object)',
					},
					{
						displayName: 'Session ID',
						name: 'sessionId',
						type: 'string',
						default: '',
						description: 'Session ID for tracking related requests',
					},
					{
						displayName: 'Session Path',
						name: 'sessionPath',
						type: 'string',
						default: '',
						description: 'Session path for hierarchical tracking',
					},
					{
						displayName: 'Session Name',
						name: 'sessionName',
						type: 'string',
						default: '',
						description: 'Human-readable session name',
					},
					{
						displayName: 'Enable Caching',
						name: 'enableCaching',
						type: 'boolean',
						default: false,
						description: 'Whether to enable response caching',
					},
					{
						displayName: 'Cache TTL (seconds)',
						name: 'cacheTtl',
						type: 'number',
						default: 604800,
						description: 'Cache time-to-live in seconds (max 31536000 = 365 days)',
						displayOptions: {
							show: {
								enableCaching: [true],
							},
						},
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('heliconeApi');

		for (let i = 0; i < items.length; i++) {
			try {
				const provider = this.getNodeParameter('provider', i) as string;
				const messages = JSON.parse(this.getNodeParameter('messages', i) as string);
				const maxTokens = this.getNodeParameter('maxTokens', i) as number;
				const temperature = this.getNodeParameter('temperature', i) as number;
				const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;

				let url: string;
				let headers: IDataObject = {
					'Content-Type': 'application/json',
					'Helicone-Auth': `Bearer ${credentials.apiKey}`,
				};
				let body: IDataObject = {};

				// Add custom properties as headers
				if (additionalOptions.customProperties) {
					const customProps = JSON.parse(additionalOptions.customProperties as string);
					for (const [key, value] of Object.entries(customProps)) {
						headers[`Helicone-Property-${key}`] = value as string;
					}
				}

				// Add session tracking headers
				if (additionalOptions.sessionId) {
					headers['Helicone-Session-Id'] = additionalOptions.sessionId;
				}
				if (additionalOptions.sessionPath) {
					headers['Helicone-Session-Path'] = additionalOptions.sessionPath;
				}
				if (additionalOptions.sessionName) {
					headers['Helicone-Session-Name'] = additionalOptions.sessionName;
				}

				// Add caching headers
				if (additionalOptions.enableCaching) {
					headers['Helicone-Cache-Enabled'] = 'true';
					const cacheTtl = additionalOptions.cacheTtl as number || 604800;
					headers['Cache-Control'] = `max-age=${cacheTtl}`;
				}

				if (provider === 'openai') {
					url = 'https://oai.helicone.ai/v1/chat/completions';
					const openaiApiKey = this.getNodeParameter('openaiApiKey', i) as string;
					const model = this.getNodeParameter('openaiModel', i) as string;

					headers['Authorization'] = `Bearer ${openaiApiKey}`;
					body = {
						model,
						messages,
						max_tokens: maxTokens,
						temperature,
					};
				} else if (provider === 'anthropic') {
					url = 'https://anthropic.helicone.ai/v1/messages';
					const anthropicApiKey = this.getNodeParameter('anthropicApiKey', i) as string;
					const model = this.getNodeParameter('anthropicModel', i) as string;
					const systemMessage = this.getNodeParameter('systemMessage', i, '') as string;

					headers['x-api-key'] = anthropicApiKey;
					headers['anthropic-version'] = '2023-06-01';
					body = {
						model,
						messages,
						max_tokens: maxTokens,
						temperature,
					};
					if (systemMessage) {
						body.system = systemMessage;
					}
				} else if (provider === 'azure') {
					const azureApiKey = this.getNodeParameter('azureApiKey', i) as string;
					const azureDomain = this.getNodeParameter('azureDomain', i) as string;
					const deploymentName = this.getNodeParameter('azureDeploymentName', i) as string;
					const apiVersion = this.getNodeParameter('azureApiVersion', i) as string;

					url = `https://oai.helicone.ai/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;
					headers['api-key'] = azureApiKey;
					headers['Helicone-OpenAI-Api-Base'] = `https://${azureDomain}`;
					body = {
						messages,
						max_tokens: maxTokens,
						temperature,
					};
				}

				const options: IHttpRequestOptions = {
					method: 'POST',
					url: url!,
					headers,
					body,
					json: true,
				};

				const response = await this.helpers.request(options);
				returnData.push({
					json: response,
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
