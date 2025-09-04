import { ChatOpenAI } from '@langchain/openai';

import {
	NodeConnectionTypes,
	type INodeType,
	type INodeTypeDescription,
	type ISupplyDataFunctions,
	type SupplyData,
} from 'n8n-workflow';

import { getConnectionHintNoticeField } from '../../utils/sharedFiles';

export class LmChatHelicone implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Helicone Chat Model',
		name: 'lmChatHelicone',
		icon: { light: 'file:helicone.svg', dark: 'file:helicone.svg' },
		group: ['transform'],
		version: [1],
		description:
      'Route requests to your chosen LLM provider through Helicone AI Gateway',
		defaults: {
			name: 'Helicone AI Gateway',
		},
		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Language Models', 'Root Nodes'],
				'Language Models': ['Chat Models (Recommended)'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://docs.helicone.ai/getting-started/quick-start',
					},
				],
			},
		},

		inputs: [],

		outputs: [NodeConnectionTypes.AiLanguageModel],
		outputNames: ['Model'],
		credentials: [
			{
				name: 'heliconeApi',
				required: true,
			},
		],
		properties: [
			getConnectionHintNoticeField([
				NodeConnectionTypes.AiChain,
				NodeConnectionTypes.AiAgent
			]),
			{
				displayName: 'Model',
				name: 'model',
				type: 'string',
				description: 'Select the model to use to generate the completion, we pick the fastest provider for you. See the <a href="https://helicone.ai/models" target="_blank">list of supported models</a>. If you want to use your own provider API keys, make sure to set these up in your <a href="https://helicone.ai/dashboard" target="_blank">Helicone Dashboard</a>.',
				default: 'gpt-4.1-mini',
			},
			{
				displayName: 'Options',
				name: 'options',
				placeholder: 'Add Option',
				description: 'Additional options to add',
				type: 'collection',
				default: {},
				options: [
					{
						displayName: 'Frequency Penalty',
						name: 'frequencyPenalty',
						default: 0,
						typeOptions: { maxValue: 2, minValue: -2, numberPrecision: 1 },
						description:
              'Use this option to control the chances of the model repeating itself. Higher values reduce the chance of the model repeating itself.',
						type: 'number',
					},
					{
						displayName: 'Maximum Number of Tokens',
						name: 'maxTokens',
						default: -1,
						description:
              'Enter the maximum number of tokens used, which sets the completion length.',
						type: 'number',
						typeOptions: {
							maxValue: 32768,
						},
					},
					{
						displayName: 'Response Format',
						name: 'responseFormat',
						default: 'text',
						type: 'options',
						options: [
							{
								name: 'Text',
								value: 'text',
								description: 'Regular text response',
							},
							{
								name: 'JSON',
								value: 'json_object',
								description: 'JSON ensures the model returns valid JSON',
							},
						],
					},
					{
						displayName: 'Presence Penalty',
						name: 'presencePenalty',
						default: 0,
						typeOptions: { maxValue: 2, minValue: -2, numberPrecision: 1 },
						description:
              'Use this option to control the chances of the model talking about new topics. Higher values increase the chance of the model talking about new topics.',
						type: 'number',
					},
					{
						displayName: 'Sampling Temperature',
						name: 'temperature',
						default: 0.7,
						typeOptions: { maxValue: 2, minValue: 0, numberPrecision: 1 },
						description:
              'Use this option to control the randomness of the sampling process. A higher temperature creates more diverse sampling, but increases the risk of hallucinations.',
						type: 'number',
					},
					{
						displayName: 'Timeout',
						name: 'timeout',
						default: 360000,
						description: 'Enter the maximum request time in milliseconds.',
						type: 'number',
					},
					{
						displayName: 'Max Retries',
						name: 'maxRetries',
						default: 2,
						description:
              'Enter the maximum number of times to retry a request.',
						type: 'number',
					},
					{
						displayName: 'Top P',
						name: 'topP',
						default: 1,
						typeOptions: { maxValue: 1, minValue: 0, numberPrecision: 1 },
						description:
              'Use this option to set the probability the completion should use. Use a lower value to ignore less probable options.',
						type: 'number',
					},
				],
			},
			{
				displayName: 'Helicone Options',
				name: 'heliconeOptions',
				placeholder: 'Add Helicone Option',
				description: 'Helicone-specific options for observability and caching',
				type: 'collection',
				default: {},
				options: [
					{
						displayName: 'Custom Properties',
						name: 'customProperties',
						type: 'json',
						default: '{}',
						description:
              'Custom properties to add to the request (JSON object)',
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
						description:
              'Cache time-to-live in seconds (max 31536000 = 365 days)',
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

	async supplyData(
		this: ISupplyDataFunctions,
		itemIndex: number
	): Promise<SupplyData> {
		const credentials = await this.getCredentials('heliconeApi');

		const modelName = this.getNodeParameter('model', itemIndex) as string;

		const options = this.getNodeParameter('options', itemIndex, {}) as {
      frequencyPenalty?: number;
			maxTokens?: number;
			maxRetries: number;
			timeout: number;
			presencePenalty?: number;
			temperature?: number;
			topP?: number;
			responseFormat?: 'text' | 'json_object';
		};

		const heliconeOptions = this.getNodeParameter(
			'heliconeOptions',
			itemIndex,
			{}
		) as {
			customProperties?: string;
			sessionId?: string;
			sessionPath?: string;
			sessionName?: string;
			enableCaching?: boolean;
			cacheTtl?: number;
		};

		const baseURL = 'https://ai-gateway.helicone.ai/';

		const customHeaders: Record<string, string> = {};

		if (heliconeOptions.customProperties) {
			try {
				const customProps = JSON.parse(heliconeOptions.customProperties);
				for (const [key, value] of Object.entries(customProps)) {
					customHeaders[`Helicone-Property-${key}`] = String(value);
				}
			} catch (error) {
				console.error(error);
			}
		}

		if (heliconeOptions.sessionId) {
			customHeaders['Helicone-Session-Id'] = heliconeOptions.sessionId;
		}
		if (heliconeOptions.sessionPath) {
			customHeaders['Helicone-Session-Path'] = heliconeOptions.sessionPath;
		}
		if (heliconeOptions.sessionName) {
			customHeaders['Helicone-Session-Name'] = heliconeOptions.sessionName;
		}

		if (heliconeOptions.enableCaching) {
			customHeaders['Helicone-Cache-Enabled'] = 'true';
			const cacheTtl = heliconeOptions.cacheTtl || 604800;
			customHeaders['Cache-Control'] = `max-age=${cacheTtl}`;
		}

		const model = new ChatOpenAI({
			modelName,
			temperature: options.temperature ?? 0.7,
			maxTokens:
				options.maxTokens && options.maxTokens > 0
					? options.maxTokens
					: undefined,
			topP: options.topP,
			frequencyPenalty: options.frequencyPenalty,
			presencePenalty: options.presencePenalty,
			timeout: options.timeout ?? 60000,
			maxRetries: options.maxRetries ?? 2,
			configuration: {
				apiKey: credentials.apiKey.toString(),
				baseURL,
				defaultHeaders: customHeaders
			},
		});

		return {
			response: model
		};
	}
}

export { LmChatHelicone as Helicone };
