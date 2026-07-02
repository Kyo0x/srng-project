#!/bin/bash

echo "🔍 Checking Tromsø Fuglehundklubb setup..."
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✅ .env.local file exists"
    
    # Check if variables are set
    if grep -q "your-project-id" .env.local; then
        echo "⚠️  WARNING: You still have placeholder values in .env.local"
        echo "   Please update with your actual Sanity credentials"
    else
        echo "✅ Environment variables appear to be configured"
    fi
else
    echo "❌ .env.local file not found"
    echo "   Run: cp .env.example .env.local"
    echo "   Then edit .env.local with your Sanity credentials"
fi

echo ""

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Dependencies not installed"
    echo "   Run: npm install"
fi

echo ""
echo "📚 Quick Start:"
echo "   1. Setup Sanity: See SETUP.md"
echo "   2. Run dev server: npm run dev"
echo "   3. Open browser: http://localhost:3000"
echo "   4. Access Studio: http://localhost:3000/studio"
echo ""
echo "📖 Documentation:"
echo "   - SETUP.md - Initial setup instructions"
echo "   - CONTENT_GUIDE.md - For content editors"
echo "   - README.md - Full documentation"
