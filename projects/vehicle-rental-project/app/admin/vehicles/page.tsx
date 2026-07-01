'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Vehicle, DriveType, Transmission } from '@/lib/types';
import { useVehicles } from '@/hooks';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { VehicleListSkeleton } from '@/components/Skeleton';
import { ImageCarousel } from '@/components/ImageCarousel';
import { api } from '@/lib/errorHandler';

export default function VehiclesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data: vehicles, loading, error, refetch } = useVehicles();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState<number | null>(null);
  const [pdfError, setPdfError] = useState<Record<number, string>>({});

  // Mileage tracking
  const [mileageOpen, setMileageOpen] = useState<number | null>(null);
  const [mileageValue, setMileageValue] = useState('');
  const [mileageNote, setMileageNote] = useState('');
  const [savingMileage, setSavingMileage] = useState(false);
  const [mileageLogs, setMileageLogs] = useState<Record<number, any[]>>({});
  const [loadingMileage, setLoadingMileage] = useState<number | null>(null);
  const [expandedMileage, setExpandedMileage] = useState<number | null>(null);

  // Pause toggle
  const [pausingVehicle, setPausingVehicle] = useState<number | null>(null);
  const [pauseError, setPauseError] = useState<Record<number, string>>({});

  const handleTogglePause = async (vehicle: Vehicle) => {
    setPausingVehicle(vehicle.id);
    setPauseError(prev => { const n = { ...prev }; delete n[vehicle.id]; return n; });
    try {
      await api('/api/vehicles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: vehicle.id, is_paused: !vehicle.is_paused }),
      });
      refetch();
    } catch (err) {
      setPauseError(prev => ({ ...prev, [vehicle.id]: err instanceof Error ? err.message : 'Failed to update vehicle' }));
    } finally {
      setPausingVehicle(null);
    }
  };

  // Blackout dates
  const [blackoutOpen, setBlackoutOpen] = useState<number | null>(null);
  const [blackoutStart, setBlackoutStart] = useState('');
  const [blackoutEnd, setBlackoutEnd] = useState('');
  const [blackoutReason, setBlackoutReason] = useState('');
  const [savingBlackout, setSavingBlackout] = useState(false);
  const [blackoutLogs, setBlackoutLogs] = useState<Record<number, any[]>>({});
  const [expandedBlackout, setExpandedBlackout] = useState<number | null>(null);
  const [loadingBlackout, setLoadingBlackout] = useState<number | null>(null);

  const fetchBlackoutDates = async (vehicleId: number) => {
    setLoadingBlackout(vehicleId);
    try {
      const res = await fetch(`/api/admin/vehicles/${vehicleId}/blackout`);
      if (!res.ok) return;
      const data = await res.json();
      setBlackoutLogs(prev => ({ ...prev, [vehicleId]: data }));
    } finally {
      setLoadingBlackout(null);
    }
  };

  const handleAddBlackout = async (vehicleId: number) => {
    if (!blackoutStart || !blackoutEnd) return;
    setSavingBlackout(true);
    try {
      const res = await fetch(`/api/admin/vehicles/${vehicleId}/blackout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start_date: blackoutStart, end_date: blackoutEnd, reason: blackoutReason }),
      });
      if (!res.ok) return;
      setBlackoutOpen(null);
      setBlackoutStart('');
      setBlackoutEnd('');
      setBlackoutReason('');
      fetchBlackoutDates(vehicleId);
      if (expandedBlackout !== vehicleId) setExpandedBlackout(vehicleId);
    } finally {
      setSavingBlackout(false);
    }
  };

  const handleDeleteBlackout = async (vehicleId: number, blackoutId: number) => {
    await fetch(`/api/admin/vehicles/${vehicleId}/blackout?id=${blackoutId}`, { method: 'DELETE' });
    setBlackoutLogs(prev => ({
      ...prev,
      [vehicleId]: (prev[vehicleId] || []).filter((b: any) => b.id !== blackoutId),
    }));
  };

  const fetchMileageLogs = async (vehicleId: number) => {
    setLoadingMileage(vehicleId);
    try {
      const res = await fetch(`/api/admin/vehicles/${vehicleId}/mileage`);
      if (!res.ok) return;
      const logs = await res.json();
      setMileageLogs(prev => ({ ...prev, [vehicleId]: logs }));
    } finally {
      setLoadingMileage(null);
    }
  };

  const handleLogMileage = async (vehicleId: number) => {
    if (!mileageValue) return;
    setSavingMileage(true);
    try {
      const res = await fetch(`/api/admin/vehicles/${vehicleId}/mileage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mileage: parseInt(mileageValue), note: mileageNote }),
      });
      if (!res.ok) return;
      setMileageOpen(null);
      setMileageValue('');
      setMileageNote('');
      refetch();
      if (expandedMileage === vehicleId) fetchMileageLogs(vehicleId);
    } finally {
      setSavingMileage(false);
    }
  };
  const [formData, setFormData] = useState({
    name: '',
    seats: 2,
    beds: 2,
    drive_type: '2WD' as DriveType,
    transmission: 'manual' as Transmission,
    has_heating: false,
    price_per_day: 100,
    image_urls: [''] as string[],
    description: '',
    license_plate: '',
    promo_price: '' as string | number,
    promo_start_date: '',
    promo_end_date: '',
    sort_order: 999 as number,
    vehicle_group: '' as string,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading' || loading) {
    return (
      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <VehicleListSkeleton count={6} />
        </div>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      setSubmitting(true);
      const method = editingId ? 'PUT' : 'POST';
      // Filter out empty image URLs before submitting
      const cleanedImageUrls = formData.image_urls.filter(url => url.trim() !== '');
      const submitData = {
        ...formData,
        image_urls: cleanedImageUrls,
        seats: Number(formData.seats),
        beds: Number(formData.beds),
        price_per_day: Number(formData.price_per_day),
        promo_price: formData.promo_price !== '' ? Number(formData.promo_price) : undefined,
        promo_start_date: formData.promo_start_date || undefined,
        promo_end_date: formData.promo_end_date || undefined,
        sort_order: Number(formData.sort_order) || 999,
        vehicle_group: formData.vehicle_group.trim() || null,
      };
      const body = editingId ? { ...submitData, id: editingId } : submitData;

      await api('/api/vehicles', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      setFormData({
        name: '',
        seats: 2,
        beds: 2,
        drive_type: '2WD',
        transmission: 'manual',
        has_heating: false,
        price_per_day: 100,
        image_urls: [''],
        description: '',
        license_plate: '',
        promo_price: '',
        promo_start_date: '',
        promo_end_date: '',
        sort_order: 999,
        vehicle_group: '',
      });
      setShowForm(false);
      setEditingId(null);
      await refetch();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save vehicle');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    // Handle both old image_url and new image_urls format
    const imageUrls = vehicle.image_urls?.length
      ? vehicle.image_urls
      : (vehicle as any).image_url
      ? [(vehicle as any).image_url]
      : [''];

    setFormData({
      name: vehicle.name,
      seats: vehicle.seats,
      beds: vehicle.beds,
      drive_type: vehicle.drive_type,
      transmission: vehicle.transmission,
      has_heating: vehicle.has_heating,
      price_per_day: vehicle.price_per_day,
      image_urls: imageUrls.length > 0 ? imageUrls : [''],
      description: vehicle.description || '',
      license_plate: vehicle.license_plate || '',
      promo_price: vehicle.promo_price ?? '',
      promo_start_date: vehicle.promo_start_date || '',
      promo_end_date: vehicle.promo_end_date || '',
      sort_order: vehicle.sort_order ?? 999,
      vehicle_group: vehicle.vehicle_group ?? '',
    });
    setEditingId(vehicle.id);
    setShowForm(true);
  };

  const addImageUrl = () => {
    setFormData({ ...formData, image_urls: [...formData.image_urls, ''] });
  };

  const removeImageUrl = (index: number) => {
    const newUrls = formData.image_urls.filter((_, i) => i !== index);
    setFormData({ ...formData, image_urls: newUrls.length > 0 ? newUrls : [''] });
  };

  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...formData.image_urls];
    newUrls[index] = value;
    setFormData({ ...formData, image_urls: newUrls });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;

    try {
      await api(`/api/vehicles?id=${id}`, { method: 'DELETE' });
      await refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete vehicle');
    }
  };

  const handleInspectionUpload = async (vehicle: Vehicle, file: File) => {
    setUploadingPdf(vehicle.id);
    setPdfError(prev => { const n = { ...prev }; delete n[vehicle.id]; return n; });
    try {
      const fd = new FormData();
      fd.append('file', file);
      const uploadRes = await fetch('/api/inspection-upload', { method: 'POST', body: fd });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed');

      // Save the URL back to the vehicle — must pass all required fields
      const imageUrls = vehicle.image_urls?.length ? vehicle.image_urls : [];
      await api('/api/vehicles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: vehicle.id,
          name: vehicle.name,
          seats: vehicle.seats,
          beds: vehicle.beds,
          drive_type: vehicle.drive_type,
          transmission: vehicle.transmission,
          has_heating: vehicle.has_heating,
          price_per_day: Number(vehicle.price_per_day),
          image_urls: imageUrls,
          description: vehicle.description || '',
          inspection_pdf_url: uploadData.url,
          license_plate: vehicle.license_plate || null,
          promo_price: vehicle.promo_price || undefined,
          promo_start_date: vehicle.promo_start_date || undefined,
          promo_end_date: vehicle.promo_end_date || undefined,
          sort_order: vehicle.sort_order ?? 999,
          vehicle_group: vehicle.vehicle_group ?? null,
        }),
      });
      await refetch();
    } catch (err) {
      setPdfError(prev => ({ ...prev, [vehicle.id]: err instanceof Error ? err.message : 'Upload failed' }));
    } finally {
      setUploadingPdf(null);
    }
  };

  const handleInspectionRemove = async (vehicle: Vehicle) => {
    if (!window.confirm('Remove the inspection form for this vehicle?')) return;
    setUploadingPdf(vehicle.id);
    setPdfError(prev => { const n = { ...prev }; delete n[vehicle.id]; return n; });
    try {
      const imageUrls = vehicle.image_urls?.length ? vehicle.image_urls : [];
      await api('/api/vehicles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: vehicle.id,
          name: vehicle.name,
          seats: vehicle.seats,
          beds: vehicle.beds,
          drive_type: vehicle.drive_type,
          transmission: vehicle.transmission,
          has_heating: vehicle.has_heating,
          price_per_day: Number(vehicle.price_per_day),
          image_urls: imageUrls,
          description: vehicle.description || '',
          inspection_pdf_url: null,
          license_plate: vehicle.license_plate || null,
          promo_price: vehicle.promo_price || undefined,
          promo_start_date: vehicle.promo_start_date || undefined,
          promo_end_date: vehicle.promo_end_date || undefined,
          sort_order: vehicle.sort_order ?? 999,
          vehicle_group: vehicle.vehicle_group ?? null,
        }),
      });
      await refetch();
    } catch (err) {
      setPdfError(prev => ({ ...prev, [vehicle.id]: err instanceof Error ? err.message : 'Remove failed' }));
    } finally {
      setUploadingPdf(null);
    }
  };

  const handleCancel = () => {    setShowForm(false);
    setEditingId(null);
    setFormError(null);
    setFormData({
      name: '',
      seats: 2,
      beds: 2,
      drive_type: '2WD',
      transmission: 'manual',
      has_heating: false,
      price_per_day: 100,
      image_urls: [''],
      description: '',
      license_plate: '',
      promo_price: '',
      promo_start_date: '',
      promo_end_date: '',
      sort_order: 999,
      vehicle_group: '',
    });
  };

  if (loading) {
    return (
      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-2xl font-semibold text-gray-900">Manage Vehicles</h1>
            <div className="h-9 w-32 bg-white rounded-lg border border-gray-100 animate-pulse" />
          </div>
          <VehicleListSkeleton count={6} />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-2xl font-semibold text-gray-900 mb-10">Manage Vehicles</h1>
          <ErrorDisplay error={error} onRetry={refetch} />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
              NorthVenture
            </p>
            <h1 className="text-2xl font-semibold text-gray-900">Manage Vehicles</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin')}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Dashboard
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:border-gray-300 transition-all"
            >
              {showForm ? 'Cancel' : '+ Add Vehicle'}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
            <h2 className="text-base font-semibold text-gray-900 mb-6">
              {editingId ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h2>

            {formError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Seats *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="10"
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Beds *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="10"
                    value={formData.beds}
                    onChange={(e) => setFormData({ ...formData, beds: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Drive Type *</label>
                  <select
                    required
                    value={formData.drive_type}
                    onChange={(e) => setFormData({ ...formData, drive_type: e.target.value as DriveType })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                  >
                    <option value="2WD">2WD</option>
                    <option value="4WD">4WD</option>
                    <option value="AWD">AWD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Transmission *</label>
                  <select
                    required
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value as Transmission })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                  >
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Price per Day (kr) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price_per_day}
                    onChange={(e) => setFormData({ ...formData, price_per_day: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">License Plate</label>
                  <input
                    type="text"
                    value={formData.license_plate}
                    onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                    placeholder="e.g. AB 12345"
                    maxLength={20}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Group</label>
                  <input
                    type="text"
                    value={formData.vehicle_group}
                    onChange={(e) => setFormData({ ...formData, vehicle_group: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                    placeholder="e.g. sprinter-3pax"
                    maxLength={100}
                  />
                  <p className="mt-1 text-xs text-gray-400">Identical vehicles share a group name. Customers see one listing per group.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Sort Order</label>
                  <input
                    type="number"
                    min="1"
                    max="9999"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 999 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                  />
                  <p className="mt-1 text-xs text-gray-400">Lower number = filled first. Set 1 for the primary vehicle in a group.</p>
                </div>
              </div>

              {/* Promotional Price */}
              <div className="border border-dashed border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Promotional Price</p>
                    <p className="text-xs text-gray-400 mt-0.5">Optional — overrides regular price during the set dates</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {formData.promo_price !== '' && formData.price_per_day > 0 && (
                      <span className="px-2 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-lg border border-red-100">
                        −{Math.round((1 - Number(formData.promo_price) / Number(formData.price_per_day)) * 100)}% off
                      </span>
                    )}
                    {(formData.promo_price !== '' || formData.promo_start_date || formData.promo_end_date) && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, promo_price: '', promo_start_date: '', promo_end_date: '' })}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors"
                      >
                        Remove promo
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Promo Price (kr/day)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.promo_price}
                      onChange={(e) => setFormData({ ...formData, promo_price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                      placeholder="e.g. 1200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Promo Start Date</label>
                    <input
                      type="date"
                      value={formData.promo_start_date}
                      onChange={(e) => setFormData({ ...formData, promo_start_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Promo End Date</label>
                    <input
                      type="date"
                      value={formData.promo_end_date}
                      min={formData.promo_start_date || undefined}
                      onChange={(e) => setFormData({ ...formData, promo_end_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                    />
                  </div>
                </div>
                {formData.promo_price !== '' && (!formData.promo_start_date || !formData.promo_end_date) && (
                  <p className="mt-3 text-xs text-amber-600">Set both start and end dates to activate the promotion.</p>
                )}
              </div>

              {/* Image URLs */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Image URLs</label>
                <div className="space-y-2">
                  {formData.image_urls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => updateImageUrl(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                        placeholder="https://example.com/image.jpg"
                      />
                      {formData.image_urls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageUrl(index)}
                          className="px-3 py-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          aria-label="Remove image URL"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImageUrl}
                    className="text-sm text-gray-500 hover:text-gray-700 transition"
                  >
                    + Add another image
                  </button>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.has_heating}
                    onChange={(e) => setFormData({ ...formData, has_heating: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-gray-600"
                  />
                  <span className="text-sm text-gray-700">Has Heating</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                  placeholder="Brief description of the vehicle..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update Vehicle' : 'Add Vehicle'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Vehicles List */}
        {!Array.isArray(vehicles) || vehicles.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            No vehicles found. Add your first vehicle above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((vehicle: Vehicle) => {
              const images = vehicle.image_urls?.length
                ? vehicle.image_urls
                : (vehicle as any).image_url
                ? [(vehicle as any).image_url]
                : [];

              return (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all duration-200"
                >
                  <ImageCarousel
                    images={images}
                    alt={vehicle.name}
                    className="h-48"
                  />
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                      {vehicle.is_paused && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold uppercase tracking-wide">Paused</span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-gray-400 mb-4">
                      <p>{vehicle.seats} seats · {vehicle.beds} beds · {vehicle.drive_type} · {vehicle.transmission}</p>
                      {vehicle.license_plate && <p>Plate: {vehicle.license_plate}</p>}
                      {vehicle.vehicle_group && (
                        <p>Group: <span className="font-medium text-gray-600">{vehicle.vehicle_group}</span> · Priority: {vehicle.sort_order ?? 999}</p>
                      )}
                      {vehicle.has_heating && <p>Heating included</p>}
                      {vehicle.current_mileage != null && (
                        <p>Odometer: <span className="font-medium text-gray-600 tabular-nums">{vehicle.current_mileage.toLocaleString()} km</span></p>
                      )}
                      <p className="text-lg font-semibold text-gray-900 pt-1 tabular-nums">
                        {vehicle.price_per_day} kr/day
                      </p>
                    </div>

                    {/* Mileage tracking */}
                    <div className="mb-4">
                      {mileageOpen === vehicle.id ? (
                        <div className="border border-gray-100 rounded-lg p-3 space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Log Odometer Reading</p>
                          <input
                            type="number"
                            min="0"
                            placeholder="Odometer (km)"
                            value={mileageValue}
                            onChange={(e) => setMileageValue(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                            autoFocus
                          />
                          <input
                            type="text"
                            placeholder="Note (optional)"
                            value={mileageNote}
                            onChange={(e) => setMileageNote(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleLogMileage(vehicle.id)}
                              disabled={savingMileage || !mileageValue}
                              className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-700 disabled:opacity-50 transition"
                            >
                              {savingMileage ? 'Saving…' : 'Save'}
                            </button>
                            <button
                              onClick={() => { setMileageOpen(null); setMileageValue(''); setMileageNote(''); }}
                              className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => { setMileageOpen(vehicle.id); setMileageValue(vehicle.current_mileage?.toString() ?? ''); setMileageNote(''); }}
                            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            + Log mileage
                          </button>
                          {(mileageLogs[vehicle.id]?.length > 0 || expandedMileage === vehicle.id) && (
                            <button
                              onClick={() => {
                                if (expandedMileage === vehicle.id) {
                                  setExpandedMileage(null);
                                } else {
                                  setExpandedMileage(vehicle.id);
                                  if (!mileageLogs[vehicle.id]) fetchMileageLogs(vehicle.id);
                                }
                              }}
                              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {expandedMileage === vehicle.id ? 'Hide history ↑' : 'History ↓'}
                            </button>
                          )}
                          {!mileageLogs[vehicle.id] && vehicle.current_mileage != null && expandedMileage !== vehicle.id && (
                            <button
                              onClick={() => { setExpandedMileage(vehicle.id); fetchMileageLogs(vehicle.id); }}
                              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              History ↓
                            </button>
                          )}
                        </div>
                      )}
                      {expandedMileage === vehicle.id && (
                        <div className="mt-2 space-y-1">
                          {loadingMileage === vehicle.id ? (
                            <p className="text-xs text-gray-400">Loading…</p>
                          ) : mileageLogs[vehicle.id]?.length === 0 ? (
                            <p className="text-xs text-gray-400">No logs yet.</p>
                          ) : (
                            mileageLogs[vehicle.id]?.map((log: any) => (
                              <div key={log.id} className="flex items-start justify-between text-xs text-gray-500 py-1 border-b border-gray-50 last:border-0">
                                <div>
                                  <span className="font-semibold text-gray-700 tabular-nums">{log.mileage.toLocaleString()} km</span>
                                  {log.note && <span className="ml-2 text-gray-400">{log.note}</span>}
                                  {log.order_id && <span className="ml-2 text-gray-300">· {log.order_id}</span>}
                                </div>
                                <span className="text-gray-300 shrink-0 ml-2">
                                  {new Date(log.logged_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>

                    {/* Maintenance / Blackout Dates */}
                    <div className="mb-4 pb-4 border-b border-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Pause for period</span>
                        <button
                          onClick={() => {
                            if (blackoutOpen === vehicle.id) {
                              setBlackoutOpen(null);
                            } else {
                              setBlackoutOpen(vehicle.id);
                              setBlackoutStart('');
                              setBlackoutEnd('');
                              setBlackoutReason('');
                            }
                          }}
                          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {blackoutOpen === vehicle.id ? 'Cancel' : '+ Add block'}
                        </button>
                      </div>

                      {blackoutOpen === vehicle.id && (
                        <div className="mb-3 p-3 bg-gray-50 rounded-lg space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Start date</label>
                              <input
                                type="date"
                                value={blackoutStart}
                                onChange={(e) => setBlackoutStart(e.target.value)}
                                className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-gray-300"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">End date</label>
                              <input
                                type="date"
                                value={blackoutEnd}
                                min={blackoutStart}
                                onChange={(e) => setBlackoutEnd(e.target.value)}
                                className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-gray-300"
                              />
                            </div>
                          </div>
                          <input
                            type="text"
                            placeholder="Reason (optional)"
                            value={blackoutReason}
                            onChange={(e) => setBlackoutReason(e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-gray-300"
                          />
                          <button
                            onClick={() => handleAddBlackout(vehicle.id)}
                            disabled={savingBlackout || !blackoutStart || !blackoutEnd}
                            className="px-3 py-1.5 bg-gray-800 text-white rounded-md text-xs font-medium hover:bg-gray-700 transition-colors disabled:opacity-40"
                          >
                            {savingBlackout ? 'Saving…' : 'Save block'}
                          </button>
                        </div>
                      )}

                      {/* Existing blocks toggle */}
                      <button
                        onClick={async () => {
                          if (expandedBlackout === vehicle.id) {
                            setExpandedBlackout(null);
                          } else {
                            setExpandedBlackout(vehicle.id);
                            if (!blackoutLogs[vehicle.id]) fetchBlackoutDates(vehicle.id);
                          }
                        }}
                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {expandedBlackout === vehicle.id ? 'Hide blocks ↑' : 'Show blocks ↓'}
                      </button>

                      {expandedBlackout === vehicle.id && (
                        <div className="mt-2 space-y-1">
                          {loadingBlackout === vehicle.id ? (
                            <p className="text-xs text-gray-400">Loading…</p>
                          ) : !blackoutLogs[vehicle.id] || blackoutLogs[vehicle.id].length === 0 ? (
                            <p className="text-xs text-gray-400">No maintenance blocks.</p>
                          ) : (
                            blackoutLogs[vehicle.id].map((b: any) => (
                              <div key={b.id} className="flex items-center justify-between text-xs text-gray-500 py-1 border-b border-gray-50 last:border-0">
                                <div>
                                  <span className="font-semibold text-gray-700">
                                    {new Date(b.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                    {' – '}
                                    {new Date(b.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </span>
                                  {b.reason && <span className="ml-2 text-gray-400">{b.reason}</span>}
                                </div>
                                <button
                                  onClick={() => handleDeleteBlackout(vehicle.id, b.id)}
                                  className="text-red-400 hover:text-red-600 transition-colors ml-2 shrink-0"
                                  title="Delete block"
                                >
                                  ×
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>

                    {vehicle.description && (
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{vehicle.description}</p>
                    )}

                    {/* Inspection PDF */}
                    <div className="mb-4">
                      {vehicle.inspection_pdf_url ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                            Inspection form
                          </span>
                          <a href={vehicle.inspection_pdf_url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline">
                            View
                          </a>
                          <label className={`text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer underline ${uploadingPdf === vehicle.id ? 'opacity-40 pointer-events-none' : ''}`}>
                            Replace
                            <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { handleInspectionUpload(vehicle, f); e.target.value = ''; } }} />
                          </label>
                          <button onClick={() => handleInspectionRemove(vehicle)} className="text-xs text-red-400 hover:text-red-600 transition-colors">
                            Remove
                          </button>
                        </div>
                      ) : (
                        <label className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-gray-200 text-xs text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors cursor-pointer ${uploadingPdf === vehicle.id ? 'opacity-40 pointer-events-none' : ''}`}>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                          {uploadingPdf === vehicle.id ? 'Uploading…' : 'Upload inspection form'}
                          <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { handleInspectionUpload(vehicle, f); e.target.value = ''; } }} />
                        </label>
                      )}
                      {pdfError[vehicle.id] && (
                        <p className="mt-1 text-xs text-red-500">{pdfError[vehicle.id]}</p>
                      )}
                    </div>

                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={() => handleTogglePause(vehicle)}
                        disabled={pausingVehicle === vehicle.id}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 ${
                          vehicle.is_paused
                            ? 'border border-green-200 text-green-700 hover:bg-green-50'
                            : 'border border-amber-200 text-amber-700 hover:bg-amber-50'
                        }`}
                      >
                        {pausingVehicle === vehicle.id ? '…' : vehicle.is_paused ? 'Unpause' : 'Pause'}
                      </button>
                    </div>
                    {pauseError[vehicle.id] && (
                      <p className="mb-2 text-xs text-red-500">{pauseError[vehicle.id]}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(vehicle)}
                        className="flex-1 px-3 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        className="flex-1 px-3 py-2 border border-red-100 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
