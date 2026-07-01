#!/bin/bash

# Stripe CLI Webhook Testing Script
# This script uses Stripe CLI to trigger test webhook events for your local development

set -e

echo "========================================="
echo "ArcticTrail - Stripe Webhook Testing"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Stripe CLI is installed
if ! command -v stripe &> /dev/null; then
    echo -e "${YELLOW}Stripe CLI is not installed. Installing...${NC}"
    curl -s https://raw.githubusercontent.com/stripe/stripe-cli/master/install.sh | sudo bash
fi

echo -e "${BLUE}Step 1: Creating test checkout session...${NC}"

# Create a test checkout session
RESPONSE=$(curl -s -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleId": "test-vehicle-1",
    "vehicleName": "ArcticTrail Test Vehicle",
    "pricePerDay": 100,
    "startDate": "2025-12-05",
    "endDate": "2025-12-10",
    "babySeatsQuantity": 1,
    "extraDriver": true,
    "insuranceType": "basic",
    "contactEmail": "test@example.com"
  }')

SESSION_ID=$(echo $RESPONSE | grep -o '"sessionId":"[^"]*' | cut -d'"' -f4)

if [ -z "$SESSION_ID" ]; then
    echo -e "${YELLOW}Error creating checkout session:${NC}"
    echo $RESPONSE
    exit 1
fi

echo -e "${GREEN}✓ Checkout session created: ${SESSION_ID}${NC}"
echo ""

echo -e "${BLUE}Step 2: Triggering test webhook event...${NC}"
echo "This will simulate a successful payment completion webhook."
echo ""

# Use Stripe CLI to trigger a test event
# Note: This sends an event to your webhook endpoint via Stripe CLI
# Make sure STRIPE_SECRET_KEY is set in your environment or .env file
stripe trigger checkout.session.completed \
  --api-key "${STRIPE_SECRET_KEY}"

echo ""
echo -e "${GREEN}✓ Webhook event triggered!${NC}"
echo ""

echo -e "${BLUE}Step 3: Checking Supabase for new booking...${NC}"
echo "Check your Supabase database bookings table for a new record."
echo ""

echo -e "${YELLOW}Testing complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Open http://localhost:3000 in your browser"
echo "2. Select dates and proceed through the booking flow"
echo "3. At payment, use test card: 4242 4242 4242 4242"
echo "4. Watch the Stripe CLI output for webhook events"
echo "5. Check Supabase bookings table for the completed booking"
