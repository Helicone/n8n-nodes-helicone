# n8n-nodes-helicone

This is an n8n community node that allows you to make LLM requests through Helicone's proxy for observability and monitoring.

[Helicone](https://helicone.ai) is an open-source LLM observability platform that helps developers monitor, debug, and improve production AI applications.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Setup Instructions

### 1. Build and Link the Node
```bash
npm install
npm run build
npm link
```

### 2. Start n8n
```bash
n8n start --tunnel
```

### 3. Access n8n Interface
Open your browser and go to: `http://localhost:5678`

## 4. Add Helicone API Credentials

  - Go to **Credentials > New**
  - Select **Helicone API**
  - Enter your Helicone API key (get it from [Helicone Dashboard](https://helicone.ai/dashboard))
  - For EU customers, change the Base URL to `https://eu.api.helicone.ai`

### 5. Create a workflow and add your Helicone node

1. **LLM Provider:** Choose between OpenAI, Anthropic, or Azure OpenAI
2. **Provider Credentials:** Enter the API key/credentials for your chosen provider
3. **Model Configuration:** Specify the model to use (e.g., `gpt-4o-mini`, `claude-3-opus-20240229`)
4. **Request Parameters:**
   - **Messages:** JSON array of messages to send to the LLM
   - **Max Tokens:** Maximum number of tokens to generate
   - **Temperature:** Sampling temperature (0-2)
   - **System Message:** (Anthropic only) System message for the conversation

### Additional Helicone Features

The node supports various Helicone features:

- **Custom Properties:** Add metadata to requests for filtering and analysis
- **Session Tracking:** Group related requests with Session ID, Path, and Name
- **Caching:** Enable response caching with configurable TTL

## Supported Providers

### OpenAI
- **URL:** `https://oai.helicone.ai/v1/chat/completions`
- **Authentication:** Bearer token in Authorization header
- **Models:** All OpenAI chat completion models

### Anthropic
- **URL:** `https://anthropic.helicone.ai/v1/messages`
- **Authentication:** API key in x-api-key header
- **Models:** All Claude models
- **Special Features:** Separate system message field

### Azure OpenAI
- **URL:** `https://oai.helicone.ai/openai/deployments/{deployment}/chat/completions`
- **Authentication:** API key in api-key header
- **Additional Required Fields:**
  - Azure domain (without https://)
  - Deployment name
  - API version

## Response Format

The node returns the complete response from the LLM provider, including:

- Generated content
- Token usage information
- Model information
- Helicone-specific metadata

All requests are automatically logged in your Helicone dashboard for observability and analysis.

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify your Helicone API key is correct (starts with `pk-` for write access)
   - Ensure your provider API key is valid
   - Check if you're using the correct base URL for EU customers

2. **Request Failures**
   - Validate your messages JSON format
   - Ensure model names are correct
   - Check token limits for your chosen model

3. **Azure OpenAI Issues**
   - Verify your Azure domain format (without https://)
   - Confirm deployment name and API version
   - Ensure your Azure API key has proper permissions

### Getting Help

- [Helicone Documentation](https://docs.helicone.ai)
- [n8n Community Forum](https://community.n8n.io)
- [Helicone Discord](https://discord.gg/helicone)

## License

MIT

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Helicone documentation](https://docs.helicone.ai)
- [Helicone GitHub](https://github.com/Helicone/helicone)
