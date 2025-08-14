# n8n-nodes-helicone

This is an n8n community node that allows you to make LLM requests through Helicone's proxy for observability and monitoring.

[Helicone](https://helicone.ai) is an open-source LLM observability platform that helps developers monitor, debug, and improve production AI applications.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-helicone` in **Enter npm package name**
4. Agree to the risks of using community nodes and select **Install**

After installation, the Helicone node will be available in your n8n workflow editor.

## Prerequisites

Before using this node, you need:

1. A [Helicone account](https://helicone.ai) and API key
2. API credentials for your chosen LLM provider:
   - OpenAI API key (for OpenAI models)
   - Anthropic API key (for Claude models)
   - Azure OpenAI credentials (for Azure OpenAI deployments)

## Configuration

### Credentials Setup

1. **Helicone API Credentials:**
   - Go to **Credentials > New**
   - Select **Helicone API**
   - Enter your Helicone API key (get it from [Helicone Dashboard](https://helicone.ai/dashboard))
   - For EU customers, change the Base URL to `https://api.eu.helicone.ai`

### Node Configuration

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

## Usage Examples

### Basic OpenAI Request

```json
{
  "provider": "openai",
  "openaiApiKey": "sk-...",
  "openaiModel": "gpt-4o-mini",
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ],
  "maxTokens": 100,
  "temperature": 0.7
}
```

### Anthropic Request with System Message

```json
{
  "provider": "anthropic",
  "anthropicApiKey": "sk-ant-...",
  "anthropicModel": "claude-3-opus-20240229",
  "systemMessage": "You are a helpful assistant.",
  "messages": [
    {
      "role": "user",
      "content": "Explain quantum computing"
    }
  ],
  "maxTokens": 500
}
```

### Request with Helicone Features

```json
{
  "provider": "openai",
  "openaiApiKey": "sk-...",
  "openaiModel": "gpt-4o-mini",
  "messages": [...],
  "additionalOptions": {
    "customProperties": {
      "environment": "production",
      "user_id": "12345",
      "feature": "chat"
    },
    "sessionId": "session-uuid-here",
    "sessionName": "Customer Support Chat",
    "enableCaching": true,
    "cacheTtl": 3600
  }
}
```

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
  - Azure domain
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
   - Verify your Helicone API key is correct
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