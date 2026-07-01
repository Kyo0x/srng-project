# Demo Pages Setup

This document explains how to use the dummy/demo versions of key pages for portfolio demonstration.

## Available Demo Pages

### 1. Fleet Page (`/our-cars`)
- **Demo file**: `app/our-cars/page-demo.tsx`
- **Original file**: `app/our-cars/page.tsx`
- Shows vehicle specifications without requiring database connection

### 2. Admin Dashboard (`/admin`)
- **Demo file**: `app/admin/page-demo.tsx`  
- **Original file**: `app/admin/page.tsx`
- Shows admin dashboard with sample bookings data
- No authentication or database required

## How to Enable Demo Mode

### Option 1: Rename Files (Temporary Demo)

```bash
# Backup originals
cd projects/vehicle-rental-project/app

# Enable fleet demo
mv our-cars/page.tsx our-cars/page.original.tsx
mv our-cars/page-demo.tsx our-cars/page.tsx

# Enable admin demo  
mv admin/page.tsx admin/page.original.tsx
mv admin/page-demo.tsx admin/page.tsx
```

### Option 2: Environment Variable (Recommended for Production)

Add to your `.env.local`:
```
NEXT_PUBLIC_DEMO_MODE=true
```

Then modify the original pages to check this variable and render the demo component when true.

### Option 3: Separate Demo Route

Access the demo versions at:
- `/our-cars-demo` - Fleet specifications demo
- `/admin-demo` - Admin dashboard demo

(Would require creating these as separate routes)

## Restoring Original Pages

```bash
cd projects/vehicle-rental-project/app

# Restore fleet page
mv our-cars/page.tsx our-cars/page-demo.tsx
mv our-cars/page.original.tsx our-cars/page.tsx

# Restore admin page
mv admin/page.tsx admin/page-demo.tsx  
mv admin/page.original.tsx admin/page.tsx
```

## Demo Features

### Fleet Demo Page
- ✅ Complete vehicle specifications
- ✅ Technical details table
- ✅ Interior features breakdown
- ✅ No database connection required
- ✅ Demo notice banner

### Admin Demo Page
- ✅ Dashboard statistics
- ✅ Sample booking list
- ✅ Expandable booking details
- ✅ Revenue analytics
- ✅ Feature list overview
- ✅ No authentication required
- ✅ Demo notice banner

## Usage in Portfolio

These demo pages are perfect for:
- Portfolio presentations
- Client demonstrations
- Local development without database setup
- Testing UI/UX without backend dependencies

The demo notices clearly indicate to viewers that these are portfolio demonstration versions.
