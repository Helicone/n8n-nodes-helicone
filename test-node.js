#!/usr/bin/env node

/**
 * Simple test script for Helicone n8n node
 * This script tests the basic functionality without requiring n8n
 */

const https = require('https');

// Configuration - Update these with your actual keys
const config = {
  heliconeApiKey: process.env.HELICONE_API_KEY || 'your-helicone-api-key',
  openaiApiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || 'your-anthropic-api-key'
};

function makeRequest(url, headers, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);

    const options = {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(url, options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsed
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: responseData
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function testOpenAI() {
  console.log('🧪 Testing OpenAI through Helicone...');

  const url = 'https://oai.helicone.ai/v1/chat/completions';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.openaiApiKey}`,
    'Helicone-Auth': `Bearer ${config.heliconeApiKey}`,
    'Helicone-Property-test': 'true',
    'Helicone-Property-environment': 'testing',
    'Helicone-Session-Id': 'test-session-123',
    'Helicone-Session-Name': 'Node Test Session'
  };

  const body = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'user', content: 'Hello! Please tell me a short joke.' }
    ],
    max_tokens: 100,
    temperature: 0.7
  };

  try {
    const response = await makeRequest(url, headers, body);
    console.log('✅ OpenAI test successful!');
    console.log('Status:', response.statusCode);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ OpenAI test failed:', error.message);
    return false;
  }
}

async function testAnthropic() {
  console.log('\n🧪 Testing Anthropic through Helicone...');

  const url = 'https://anthropic.helicone.ai/v1/messages';
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': config.anthropicApiKey,
    'anthropic-version': '2023-06-01',
    'Helicone-Auth': `Bearer ${config.heliconeApiKey}`,
    'Helicone-Property-test': 'true',
    'Helicone-Property-environment': 'testing',
    'Helicone-Session-Id': 'test-session-456',
    'Helicone-Session-Name': 'Anthropic Test Session'
  };

  const body = {
    model: 'claude-3-opus-20240229',
    messages: [
      { role: 'user', content: 'Hello! Please tell me a short joke.' }
    ],
    max_tokens: 100,
    temperature: 0.7,
    system: 'You are a helpful assistant.'
  };

  try {
    const response = await makeRequest(url, headers, body);
    console.log('✅ Anthropic test successful!');
    console.log('Status:', response.statusCode);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Anthropic test failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Helicone n8n Node Tests\n');

  // Check if API keys are configured
  if (!config.heliconeApiKey || config.heliconeApiKey === 'your-helicone-api-key') {
    console.error('❌ Please set HELICONE_API_KEY environment variable');
    process.exit(1);
  }

  if (!config.openaiApiKey || config.openaiApiKey === 'your-openai-api-key') {
    console.error('❌ Please set OPENAI_API_KEY environment variable');
    process.exit(1);
  }

  const results = {
    openai: false,
    anthropic: false
  };

  // Test OpenAI
  results.openai = await testOpenAI();

  // Test Anthropic (optional)
  if (config.anthropicApiKey && config.anthropicApiKey !== 'your-anthropic-api-key') {
    results.anthropic = await testAnthropic();
  } else {
    console.log('\n⏭️  Skipping Anthropic test (no API key provided)');
  }

  // Summary
  console.log('\n📊 Test Results:');
  console.log('OpenAI:', results.openai ? '✅ PASS' : '❌ FAIL');
  console.log('Anthropic:', results.anthropic ? '✅ PASS' : '⏭️  SKIP');

  if (results.openai) {
    console.log('\n🎉 Basic functionality test passed!');
    console.log('💡 Next steps:');
    console.log('   1. Open n8n at http://localhost:5678');
    console.log('   2. Create a new workflow');
    console.log('   3. Add the Helicone node');
    console.log('   4. Configure credentials and test');
  } else {
    console.log('\n❌ Tests failed. Please check your API keys and try again.');
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testOpenAI, testAnthropic };
