# Testing Guide for Helicone n8n Node

## Prerequisites

1. **Helicone API Key**: Get your API key from [Helicone Dashboard](https://helicone.ai/dashboard)
2. **OpenAI API Key**: For testing OpenAI provider
3. **Anthropic API Key**: For testing Anthropic provider (optional)
4. **Azure OpenAI**: For testing Azure provider (optional)

## Setup Instructions

### 1. Build the Node
```bash
pnpm install
pnpm build
```

### 2. Set up n8n Custom Node
Navigate to your n8n folder (usually `~/.n8n` on macOS/Linux):
```bash
cd ~/.n8n
mkdir custom
cd custom
pnpm init
```

### 3. Link the Node
Link your built node to the n8n custom folder:
```bash
pnpm link /path/to/your/helicone-n8n-node
```
Replace `/path/to/your/helicone-n8n-node` with the actual path to your repository.

### 4. Start n8n
```bash
n8n start
```

### 5. Access n8n Interface
Open your browser and go to: `http://localhost:5678`

## Testing Steps

### Step 1: Configure Helicone Credentials

1. In n8n, go to **Settings** → **Credentials**
2. Click **Add Credential**
3. Search for "Helicone API" and select it
4. Enter your Helicone API key (starts with `pk-` for write access)
5. Save the credential

### Step 2: Create a Test Workflow

1. Click **New Workflow**
2. Add a **Helicone** node (search for "Helicone" in the nodes panel)
3. Configure the node with the following settings:

#### For OpenAI Testing:
- **LLM Provider**: OpenAI
- **OpenAI API Key**: Your OpenAI API key
- **Model**: `gpt-4o-mini`
- **Messages**: `[{"role": "user", "content": "Hello! Tell me a joke."}]`
- **Max Tokens**: 100
- **Temperature**: 0.7

#### For Anthropic Testing:
- **LLM Provider**: Anthropic
- **Anthropic API Key**: Your Anthropic API key
- **Model**: `claude-3-opus-20240229`
- **Messages**: `[{"role": "user", "content": "Hello! Tell me a joke."}]`
- **System Message**: `You are a helpful assistant.`
- **Max Tokens**: 100
- **Temperature**: 0.7

### Step 3: Test Helicone Features

#### Custom Properties
Add custom properties to track your requests:
```json
{
  "test": "true",
  "environment": "development",
  "user_id": "12345"
}
```

#### Session Tracking
- **Session ID**: `test-session-123`
- **Session Name**: `Test Session`
- **Session Path**: `testing/unit-tests`

#### Caching
- **Enable Caching**: `true`
- **Cache TTL**: `3600` (1 hour)

### Step 4: Execute the Workflow

1. Click **Execute Workflow** button
2. Check the output in the node
3. Verify the response contains the expected LLM response

### Step 5: Verify in Helicone Dashboard

1. Go to [Helicone Dashboard](https://app.helicone.ai/)
2. Check the **Requests** tab
3. Verify your test request appears with:
   - Custom properties
   - Session information
   - Request/response data
   - Performance metrics

## Test Cases

### Test Case 1: Basic OpenAI Request
- Provider: OpenAI
- Model: gpt-4o-mini
- Simple user message
- Verify response and Helicone tracking

### Test Case 2: Anthropic Request
- Provider: Anthropic
- Model: claude-3-opus-20240229
- Include system message
- Verify response format

### Test Case 3: Custom Properties
- Add multiple custom properties
- Verify they appear in Helicone dashboard
- Check property filtering

### Test Case 4: Session Tracking
- Use session ID, name, and path
- Make multiple requests with same session
- Verify session grouping in dashboard

### Test Case 5: Caching
- Enable caching with TTL
- Make identical requests
- Verify cached responses

### Test Case 6: Error Handling
- Use invalid API keys
- Test with malformed messages
- Verify error responses

## Troubleshooting

### Common Issues

1. **Node not found**: Ensure you've run `npm link` and restarted n8n
2. **Build errors**: Check TypeScript compilation with `npm run build`
3. **Credential errors**: Verify API keys are correct (Helicone key should start with `pk-`)
4. **Network errors**: Check internet connection and API endpoints

### Debug Mode

Start n8n with debug logging:
```bash
DEBUG=n8n:* n8n start
```

### Check Node Registration

Verify your node is registered:
```bash
n8n list-nodes | grep helicone
```

## Expected Results

- ✅ Helicone node appears in n8n interface
- ✅ Credentials can be configured
- ✅ Requests are sent to Helicone proxy
- ✅ Responses are received correctly
- ✅ Data appears in Helicone dashboard
- ✅ Custom properties are tracked
- ✅ Session information is preserved
- ✅ Caching works as expected

## Performance Testing

1. **Load Testing**: Send multiple concurrent requests
2. **Latency Testing**: Measure response times
3. **Error Rate Testing**: Test with various error conditions
4. **Memory Testing**: Monitor memory usage during extended use

## Security Testing

1. **API Key Security**: Verify keys are not logged
2. **Data Privacy**: Check sensitive data handling
3. **Input Validation**: Test with malicious inputs
4. **Rate Limiting**: Test with high request volumes
