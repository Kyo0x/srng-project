#!/bin/bash

# Script to toggle between demo and original pages/APIs

cd "$(dirname "$0")/projects/vehicle-rental-project/app"

# Check if we're enabling or disabling demo mode
if [ "$1" == "enable" ]; then
    echo "🎭 Enabling demo mode..."
    
    # Fleet page
    if [ -f "our-cars/page.tsx" ] && [ ! -f "our-cars/page.original.tsx" ]; then
        mv our-cars/page.tsx our-cars/page.original.tsx
        mv our-cars/page-demo.tsx our-cars/page.tsx
        echo "✓ Fleet page switched to demo"
    fi
    
    # Admin page
    if [ -f "admin/page.tsx" ] && [ ! -f "admin/page.original.tsx" ]; then
        mv admin/page.tsx admin/page.original.tsx
        mv admin/page-demo.tsx admin/page.tsx
        echo "✓ Admin page switched to demo"
    fi
    
    # Admin layout
    if [ -f "admin/layout.tsx" ] && [ ! -f "admin/layout.original.tsx" ]; then
        mv admin/layout.tsx admin/layout.original.tsx
        mv admin/layout-demo.tsx admin/layout.tsx
        echo "✓ Admin layout switched to demo (auth disabled)"
    fi
    
    # Admin login page
    if [ -f "admin/login/page.tsx" ] && [ ! -f "admin/login/page.original.tsx" ]; then
        mv admin/login/page.tsx admin/login/page.original.tsx
        mv admin/login/page-demo.tsx admin/login/page.tsx
        echo "✓ Admin login page switched to demo"
    fi
    
    # Booking page
    if [ -f "booking/[vehicleId]/page.tsx" ] && [ ! -f "booking/[vehicleId]/page.original.tsx" ]; then
        mv booking/[vehicleId]/page.tsx booking/[vehicleId]/page.original.tsx
        mv booking/[vehicleId]/page-demo.tsx booking/[vehicleId]/page.tsx
        echo "✓ Booking page switched to demo (payment skipped)"
    fi
    
    # API: Vehicles
    if [ -f "api/vehicles/route.ts" ] && [ ! -f "api/vehicles/route.original.ts" ]; then
        mv api/vehicles/route.ts api/vehicles/route.original.ts
        mv api/vehicles/route-demo.ts api/vehicles/route.ts
        echo "✓ Vehicles API switched to demo"
    fi
    
    # API: Availability
    if [ -f "api/bookings/availability/route.ts" ] && [ ! -f "api/bookings/availability/route.original.ts" ]; then
        mv api/bookings/availability/route.ts api/bookings/availability/route.original.ts
        mv api/bookings/availability/route-demo.ts api/bookings/availability/route.ts
        echo "✓ Availability API switched to demo"
    fi
    
    # API: Booking Rules
    if [ -f "api/booking-rules/route.ts" ] && [ ! -f "api/booking-rules/route.original.ts" ]; then
        mv api/booking-rules/route.ts api/booking-rules/route.original.ts
        mv api/booking-rules/route-demo.ts api/booking-rules/route.ts
        echo "✓ Booking Rules API switched to demo"
    fi
    
    echo ""
    echo "✅ Demo mode enabled!"
    echo "   Pages: /our-cars, /admin, /admin/login (demo data, no auth)"
    echo "   APIs: /api/vehicles, /api/bookings/availability, /api/booking-rules (mock data)"

elif [ "$1" == "disable" ]; then
    echo "🔄 Disabling demo mode..."
    
    # Fleet page
    if [ -f "our-cars/page.original.tsx" ]; then
        mv our-cars/page.tsx our-cars/page-demo.tsx
        mv our-cars/page.original.tsx our-cars/page.tsx
        echo "✓ Fleet page restored to original"
    fi
    
    # Admin page
    if [ -f "admin/page.original.tsx" ]; then
        mv admin/page.tsx admin/page-demo.tsx
        mv admin/page.original.tsx admin/page.tsx
        echo "✓ Admin page restored to original"
    fi
    
    # Admin layout
    if [ -f "admin/layout.original.tsx" ]; then
        mv admin/layout.tsx admin/layout-demo.tsx
        mv admin/layout.original.tsx admin/layout.tsx
        echo "✓ Admin layout restored to original"
    fi
    
    # Admin login page
    if [ -f "admin/login/page.original.tsx" ]; then
        mv admin/login/page.tsx admin/login/page-demo.tsx
        mv admin/login/page.original.tsx admin/login/page.tsx
        echo "✓ Admin login page restored to original"
    fi
    
    # Booking page
    if [ -f "booking/[vehicleId]/page.original.tsx" ]; then
        mv booking/[vehicleId]/page.tsx booking/[vehicleId]/page-demo.tsx
        mv booking/[vehicleId]/page.original.tsx booking/[vehicleId]/page.tsx
        echo "✓ Booking page restored to original"
    fi
    
    # API: Vehicles
    if [ -f "api/vehicles/route.original.ts" ]; then
        mv api/vehicles/route.ts api/vehicles/route-demo.ts
        mv api/vehicles/route.original.ts api/vehicles/route.ts
        echo "✓ Vehicles API restored to original"
    fi
    
    # API: Availability
    if [ -f "api/bookings/availability/route.original.ts" ]; then
        mv api/bookings/availability/route.ts api/bookings/availability/route-demo.ts
        mv api/bookings/availability/route.original.ts api/bookings/availability/route.ts
        echo "✓ Availability API restored to original"
    fi
    
    # API: Booking Rules
    if [ -f "api/booking-rules/route.original.ts" ]; then
        mv api/booking-rules/route.ts api/booking-rules/route-demo.ts
        mv api/booking-rules/route.original.ts api/booking-rules/route.ts
        echo "✓ Booking Rules API restored to original"
    fi
    
    echo ""
    echo "✅ Demo mode disabled!"
    echo "   Original pages and APIs restored"

else
    echo "Usage: ./toggle-demo.sh [enable|disable]"
    echo ""
    echo "  enable  - Switch to demo versions (no database required)"
    echo "  disable - Restore original versions (requires database)"
    exit 1
fi
