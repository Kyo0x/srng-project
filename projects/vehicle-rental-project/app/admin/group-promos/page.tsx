'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Vehicle } from '@/lib/types';

const SEASONS = ['spring', 'summer', 'autumn', 'winter'] as const;
type Season = typeof SEASONS[number];

const SEASON_LABELS: Record<Season, string> = {
  spring: 'Spring',
  summer: 'Summer',
  autumn: 'Autumn',
  winter: 'Winter',
};

interface GroupPromo {
  vehicle_group: string;
  season: Season;
  promo_text: string;
  promo_price: number | null;
  promo_start_date: string | null;
  promo_end_date: string | null;
  enabled: boolean;
}

interface SeasonFields {
  promo_text: string;
  promo_price: string;
  promo_start_date: string;
  promo_end_date: string;
  enabled: boolean;
}

const emptyFields = (): SeasonFields => ({
  promo_text: '',
  promo_price: '',
  promo_start_date: '',
  promo_end_date: '',
  enabled: false,
});

export default function GroupPromosPage() {
  const router = useRouter();
  const { status } = useSession();
  const [groups, setGroups] = useState<string[]>([]);
  const [fields, setFields] = useState<Record<string, Record<Season, SeasonFields>>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [vehiclesRes, promosRes] = await Promise.all([
          fetch('/api/vehicles'),
          fetch('/api/admin/group-promos'),
        ]);
        const vehicles: Vehicle[] = await vehiclesRes.json();
        const existingPromos: GroupPromo[] = await promosRes.json();

        const uniqueGroups = Array.from(
          new Set(vehicles.map(v => v.vehicle_group).filter(Boolean) as string[])
        ).sort();

        const initialFields: Record<string, Record<Season, SeasonFields>> = {};
        for (const g of uniqueGroups) {
          initialFields[g] = {
            spring: emptyFields(),
            summer: emptyFields(),
            autumn: emptyFields(),
            winter: emptyFields(),
          };
        }
        for (const p of existingPromos) {
          if (initialFields[p.vehicle_group]) {
            initialFields[p.vehicle_group][p.season] = {
              promo_text: p.promo_text,
              promo_price: p.promo_price != null ? String(p.promo_price) : '',
              promo_start_date: p.promo_start_date ?? '',
              promo_end_date: p.promo_end_date ?? '',
              enabled: p.enabled ?? false,
            };
          }
        }

        setGroups(uniqueGroups);
        setFields(initialFields);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const setField = (group: string, season: Season, key: keyof SeasonFields, value: string | boolean) => {
    setFields(prev => ({
      ...prev,
      [group]: {
        ...prev[group],
        [season]: { ...prev[group][season], [key]: value },
      },
    }));
  };

  const handleSave = async (group: string, season: Season) => {
    const key = `${group}:${season}`;
    setSaving(prev => ({ ...prev, [key]: true }));
    setFeedback(prev => ({ ...prev, [key]: '' }));

    const f = fields[group]?.[season];
    const promoPrice = f.promo_price !== '' ? parseFloat(f.promo_price) : null;

    try {
      const res = await fetch('/api/admin/group-promos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle_group: group,
          season,
          promo_text: f.promo_text,
          promo_price: promoPrice,
          promo_start_date: f.promo_start_date || null,
          promo_end_date: f.promo_end_date || null,
          enabled: f.enabled,
        }),
      });

      if (res.ok) {
        setFeedback(prev => ({ ...prev, [key]: 'Saved' }));
        setTimeout(() => setFeedback(prev => ({ ...prev, [key]: '' })), 2500);
      } else {
        setFeedback(prev => ({ ...prev, [key]: 'Error saving' }));
      }
    } catch {
      setFeedback(prev => ({ ...prev, [key]: 'Error saving' }));
    } finally {
      setSaving(prev => ({ ...prev, [key]: false }));
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-10">
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Group Promotions</h1>
      <p className="text-sm text-gray-500 mb-8">
        Set seasonal promotions per vehicle group. The active promotion appears in the popup on the homepage. Dates are optional — if left blank the promotion runs for the whole season.
      </p>

      {groups.length === 0 && (
        <p className="text-sm text-gray-400">No vehicle groups found. Assign vehicles to a group on the Vehicles page first.</p>
      )}

      {groups.map(group => (
        <div key={group} className="mb-10">
          <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
            {group}
          </h2>
          <div className="space-y-6">
            {SEASONS.map(season => {
              const key = `${group}:${season}`;
              const isSaving = saving[key];
              const fb = feedback[key];
              const f = fields[group]?.[season] ?? emptyFields();
              return (
                <div key={season} className={`rounded-xl border p-4 transition-colors ${f.enabled ? 'border-primary-200 bg-primary-50/30' : 'border-gray-100 bg-gray-50/50'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-700">{SEASON_LABELS[season]}</p>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={f.enabled}
                      onClick={() => setField(group, season, 'enabled', !f.enabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 ${f.enabled ? 'bg-primary-600' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${f.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Promotional text</label>
                      <textarea
                        rows={2}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-white"
                        placeholder={`${SEASON_LABELS[season]} offer description…`}
                        value={f.promo_text}
                        onChange={e => setField(group, season, 'promo_text', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Promo price (kr/day)</label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                          placeholder="e.g. 1200"
                          value={f.promo_price}
                          onChange={e => setField(group, season, 'promo_price', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Start date</label>
                        <input
                          type="date"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                          value={f.promo_start_date}
                          onChange={e => setField(group, season, 'promo_start_date', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">End date</label>
                        <input
                          type="date"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                          value={f.promo_end_date}
                          onChange={e => setField(group, season, 'promo_end_date', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end items-center gap-3">
                      {fb && (
                        <span className={`text-xs font-medium ${fb === 'Saved' ? 'text-green-600' : 'text-red-500'}`}>
                          {fb}
                        </span>
                      )}
                      <button
                        onClick={() => handleSave(group, season)}
                        disabled={isSaving}
                        className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
                      >
                        {isSaving ? 'Saving…' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
