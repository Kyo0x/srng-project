#!/bin/bash

# Script to run the IT-Hjelperen demo locally
# This will start the SvelteKit site on port 3003

echo "🖥️  Starting IT-Hjelperen Demo..."
echo ""
echo "The demo will be available at: http://localhost:3003"
echo ""

cd "$(dirname "$0")/projects/it-hjelperen"

if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🚀 Starting development server on port 3003..."
npm run dev -- --port 3003
