#!/bin/bash

# Script to run the TFK hunting dog club demo locally
# This will start the tfk-website platform on port 3002

echo "🐕 Starting Hunting Dog Portal Demo..."
echo ""
echo "The demo will be available at: http://localhost:3002"
echo "The showcase page will link to this when running locally."
echo ""

cd "$(dirname "$0")/projects/tfk-website"

if [ ! -f ".env.local" ]; then
    echo "⚠️  No .env.local found. Copy .env.example to .env.local and add your"
    echo "   Sanity project credentials (NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET)"
    echo "   before the site will render."
    echo ""
fi

if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🚀 Starting development server on port 3002..."
npm run dev -- -p 3002
