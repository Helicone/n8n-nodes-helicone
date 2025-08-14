#!/bin/bash

# Quick test script for Helicone n8n node
echo "🚀 Quick Test for Helicone n8n Node"
echo "=================================="

# Check if n8n is running
if curl -s http://localhost:5678 > /dev/null; then
    echo "✅ n8n is running on http://localhost:5678"
else
    echo "❌ n8n is not running. Please start it with: n8n start --tunnel"
    exit 1
fi

# Check if node is built
if [ ! -d "dist" ]; then
    echo "🔨 Building node..."
    npm run build
fi

# Check if node is linked
if ! npm list -g | grep -q "n8n-nodes-helicone"; then
    echo "🔗 Linking node..."
    npm link
fi

echo ""
echo "📋 Next Steps:"
echo "1. Open http://localhost:5678 in your browser"
echo "2. Go to Settings → Credentials"
echo "3. Add Helicone API credential with your API key"
echo "4. Create a new workflow"
echo "5. Add the Helicone node and configure it"
echo ""
echo "🧪 To run API tests (optional):"
echo "export HELICONE_API_KEY='your-helicone-key'"
echo "export OPENAI_API_KEY='your-openai-key'"
echo "node test-node.js"
echo ""
echo "📖 For detailed testing guide, see: TESTING_GUIDE.md"
