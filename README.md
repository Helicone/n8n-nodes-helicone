# n8n-nodes-helicone

This is an n8n community node that provides a LangChain-compatible Helicone Chat Model for use in AI chains and workflows.

[Helicone](https://helicone.ai) is an open-source LLM observability platform that helps developers monitor, debug, and improve production AI applications.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Setup Instructions

### 1. Build and Link the Node
Clone the repository and install dependencies:
```bash
git clone https://github.com/juliettech13/helicone-n8n-node.git
cd helicone-n8n-node
```

Build the node and link it:
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
  - Select **Helicone LLM Observability**
  - Enter your Helicone API key (get it from [Helicone Dashboard](https://helicone.ai/dashboard))
  - The base URL is automatically set to `https://ai-gateway.helicone.ai/v1`

### 5. Create a workflow and add your Helicone Chat Model node

The Helicone Chat Model node is designed to work as part of AI chains. It outputs a LangChain-compatible model that can be used with other AI nodes.

**Node Configuration:**
1. **LLM Provider:** Choose between OpenAI, Anthropic, or Azure OpenAI
2. **Model:** Specify the model to use (e.g., `gpt-4o-mini`, `claude-3-opus-20240229`)
3. **Options:**
   - **Temperature:** Sampling temperature (0-2)
   - **Max Tokens:** Maximum number of tokens to generate
   - **Top P:** Nucleus sampling parameter (0-1)
   - **Frequency Penalty:** Control repetition (-2 to 2)
   - **Presence Penalty:** Control new topics (-2 to 2)
   - **Response Format:** Text or JSON
   - **Timeout:** Request timeout in milliseconds
   - **Max Retries:** Number of retry attempts

**Helicone Options:**
- **Custom Properties:** JSON object for metadata and filtering
- **Session Tracking:** Session ID, Path, and Name for grouping requests
- **Caching:** Enable response caching with configurable TTL

## How It Works

The Helicone Chat Model node uses the [Helicone AI Gateway](https://ai-gateway.helicone.ai) to route requests to your chosen LLM provider. This provides:

- **Unified Interface:** Single endpoint for multiple providers
- **Automatic Logging:** All requests are logged in your Helicone dashboard
- **Observability:** Track usage, performance, and costs across providers
- **Caching:** Reduce costs with intelligent response caching

## Supported Providers

The node supports requests to all major LLM providers through the Helicone AI Gateway:

### OpenAI
- **Models:** All OpenAI chat completion models
- **Authentication:** Via Helicone API key

### Anthropic
- **Models:** All Claude models
- **Authentication:** Via Helicone API key

### Azure OpenAI
- **Models:** All Azure OpenAI deployments
- **Authentication:** Via Helicone API key

## Usage in AI Chains

This node is designed to be used as part of n8n's AI chain functionality:

1. **Add the Helicone Chat Model node** to your workflow
2. **Configure the model** with your desired parameters
3. **Connect it to other AI nodes** that accept `ai_languageModel` inputs
4. **Use in chains** for complex AI workflows

The node outputs a LangChain-compatible model that can be used with:
- Chat nodes
- Chain nodes
- Other AI processing nodes

## Helicone Features

The node supports various Helicone observability features:

- **Custom Properties:** Add metadata to requests for filtering and analysis
- **Session Tracking:** Group related requests with Session ID, Path, and Name
- **Caching:** Enable response caching with configurable TTL (up to 365 days)
- **Automatic Logging:** All requests are automatically logged in your Helicone dashboard

## Response Format

The node returns a LangChain ChatOpenAI model instance that can be used with other AI nodes. The underlying responses include:

- Generated content
- Token usage information
- Model information
- Helicone-specific metadata

All requests are automatically logged in your Helicone dashboard for observability and analysis.

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify your Helicone API key is correct (starts with `pk-` for write access)
   - Ensure your Helicone account has access to the chosen provider

2. **Model Errors**
   - Validate your model name is correct for the chosen provider
   - Check if the model is available in your Helicone account

3. **Chain Integration Issues**
   - Ensure the node is properly connected to other AI nodes
   - Verify the output type is compatible with downstream nodes

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
- [LangChain documentation](https://js.langchain.com/)
