#!/bin/bash

# Script to run the vehicle rental demo locally
# This will start the vehicle rental platform on port 3001

echo "🚐 Starting Vehicle Rental Demo..."
echo ""
echo "The demo will be available at: http://localhost:3001"
echo "The showcase page will link to this when running locally."
echo ""

cd "$(dirname "$0")/projects/vehicle-rental-project"

if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🚀 Starting development server on port 3001..."
npm run dev -- -p 3001
