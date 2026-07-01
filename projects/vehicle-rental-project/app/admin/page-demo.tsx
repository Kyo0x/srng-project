'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';

interface DashboardStats {
  totalVehicles: number;
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  occupancyRate: number;
}

const DEMO_STATS: DashboardStats = {
  totalVehicles: 3,
  totalBookings: 24,
  completedBookings: 18,
  pendingBookings: 6,
  totalRevenue: 145800,
  occupancyRate: 67.5,
};

const DEMO_BOOKINGS = [
  {
    id: 1,
    customer_name: 'John Anderson',
    customer_email: 'john.a@example.com',
    start_date: '2024-07-15',
    end_date: '2024-07-22',
    total_price: 6800,
    status: 'confirmed',
    vehicle_name: 'Campervan #1',
  },
  {
    id: 2,
    customer_name: 'Maria Schmidt',
    customer_email: 'maria.s@example.com',
    start_date: '2024-07-18',
    end_date: '2024-07-25',
    total_price: 7200,
    status: 'confirmed',
    vehicle_name: 'Campervan #2',
  },
  {
    id: 3,
    customer_name: 'David Peterson',
    customer_email: 'david.p@example.com',
    start_date: '2024-08-01',
    end_date: '2024-08-10',
    total_price: 9500,
    status: 'pending',
    vehicle_name: 'Campervan #1',
  },
  {
    id: 4,
    customer_name: 'Sarah Johnson',
    customer_email: 'sarah.j@example.com',
    start_date: '2024-08-05',
    end_date: '2024-08-12',
    total_price: 7800,
    status: 'pending',
    vehicle_name: 'Campervan #3',
  },
];

function StatCard({ label, value, subtext }: { label: string; value: string | number; subtext?: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {subtext && <p className="text-sm text-gray-500 mt-1">{subtext}</p>}
    </div>
  );
}

export default function AdminDashboardDemo() {
  const [expandedBookingId, setExpandedBookingId] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage bookings and monitor your fleet</p>
        </div>

        {/* Demo Notice */}
        <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-medium text-yellow-900">Portfolio Demo Mode</p>
              <p className="text-sm text-yellow-800 mt-1">
                This is a demonstration admin dashboard with sample data. In the real application, this connects to a live database with authentication.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <StatCard 
            label="Total Vehicles" 
            value={DEMO_STATS.totalVehicles} 
            subtext="Active fleet"
          />
          <StatCard 
            label="Total Bookings" 
            value={DEMO_STATS.totalBookings} 
            subtext={`${DEMO_STATS.completedBookings} completed`}
          />
          <StatCard 
            label="Pending Bookings" 
            value={DEMO_STATS.pendingBookings} 
            subtext="Awaiting confirmation"
          />
          <StatCard 
            label="Total Revenue" 
            value={formatCurrency(DEMO_STATS.totalRevenue)} 
            subtext="From completed bookings"
          />
          <StatCard 
            label="Occupancy Rate" 
            value={`${DEMO_STATS.occupancyRate}%`} 
            subtext="Last 30 days"
          />
          <StatCard 
            label="Avg Booking Value" 
            value={formatCurrency(DEMO_STATS.totalRevenue / DEMO_STATS.completedBookings)} 
            subtext="Per completed booking"
          />
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {DEMO_BOOKINGS.map((booking) => (
              <div key={booking.id}>
                <div 
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setExpandedBookingId(expandedBookingId === booking.id ? null : booking.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-medium text-gray-900">{booking.customer_name}</p>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{booking.customer_email}</p>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>📅 {booking.start_date} → {booking.end_date}</span>
                        <span>🚐 {booking.vehicle_name}</span>
                        <span className="font-medium text-gray-900">{formatCurrency(booking.total_price)}</span>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      {expandedBookingId === booking.id ? '▲' : '▼'}
                    </button>
                  </div>
                </div>
                
                {expandedBookingId === booking.id && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">Booking Details</p>
                        <p className="text-sm text-gray-700">Booking ID: #{booking.id}</p>
                        <p className="text-sm text-gray-700">Duration: {Math.ceil((new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24))} days</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">Actions</p>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                            View Details
                          </button>
                          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Feature List */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Admin Features (Full Version)</h3>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Booking management
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Vehicle fleet tracking
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Revenue analytics
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Customer management
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Calendar availability
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Payment tracking
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Email notifications
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Document management
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              User authentication
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
