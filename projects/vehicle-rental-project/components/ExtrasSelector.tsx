'use client';

import { useState, useMemo, useEffect } from 'react';
import { InsuranceType } from '@/lib/types';
import {
  INSURANCE_OPTIONS,
  EXTRAS_BY_CATEGORY,
  Extra,
  SelectedExtras,
  CURRENCY,
} from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

interface ExtrasSelectorProps {
  loading?: boolean;
  numberOfDays: number;
  onChange?: (data: { insuranceType: InsuranceType; selectedExtras: SelectedExtras }) => void;
  initialValues?: { insuranceType: InsuranceType; selectedExtras: SelectedExtras };
  extrasAvailability?: Record<string, number>;
}

interface ExtraItemProps {
  extra: Extra;
  quantity: number;
  numberOfDays: number;
  onQuantityChange: (id: string, quantity: number) => void;
  loading?: boolean;
  isFreeWithInsurance?: boolean;
  availableStock?: number;
}

const ExtraItem = ({ extra, quantity, numberOfDays, onQuantityChange, loading, isFreeWithInsurance, availableStock }: ExtraItemProps) => {
  // If globalMax is set, cap effective max by available stock (+ already selected by this user)
  const effectiveMax = extra.globalMax !== undefined
    ? Math.min(extra.maxQuantity, (availableStock ?? 0) + quantity)
    : extra.maxQuantity;
  const noneAvailable = extra.globalMax !== undefined && effectiveMax === 0;
  const itemCost = useMemo(() => {
    if (quantity <= 0) return 0;
    const paidQuantity = isFreeWithInsurance ? Math.max(0, quantity - 1) : quantity;
    if (paidQuantity <= 0) return 0;
    if (extra.priceType === 'per_day') {
      // Apply per-unit price cap if defined
      const costPerUnit = extra.maxPrice !== undefined
        ? Math.min(extra.price * numberOfDays, extra.maxPrice)
        : extra.price * numberOfDays;
      return costPerUnit * paidQuantity;
    }
    return extra.price * paidQuantity;
  }, [extra, quantity, numberOfDays, isFreeWithInsurance]);

  const isCapReached = useMemo(() => {
    return extra.priceType === 'per_day' && extra.maxPrice !== undefined && extra.price * numberOfDays >= extra.maxPrice;
  }, [extra, numberOfDays]);

  const priceLabel = useMemo(() => {
    if (isFreeWithInsurance) return 'Included with insurance';
    switch (extra.priceType) {
      case 'per_day':
        if (extra.maxPrice !== undefined) {
          return isCapReached
            ? `${extra.price} ${CURRENCY.SYMBOL}/day (max ${extra.maxPrice} ${CURRENCY.SYMBOL})`
            : `${extra.price} ${CURRENCY.SYMBOL}/day (max ${extra.maxPrice} ${CURRENCY.SYMBOL})`;
        }
        return `${extra.price} ${CURRENCY.SYMBOL}/day`;
      case 'one_time':
        return `${extra.price} ${CURRENCY.SYMBOL}`;
      case 'purchase':
        return `${extra.price} ${CURRENCY.SYMBOL} (buy)`;
    }
  }, [extra, isFreeWithInsurance, isCapReached]);

  if (extra.maxQuantity === 1) {
    // Checkbox style for single items
    return (
      <div className={`border rounded-xl p-4 bg-white hover:shadow-sm transition-all ${noneAvailable ? 'border-gray-200 opacity-60' : 'border-gray-100'}`}>
        <label className={`flex items-center gap-3 ${noneAvailable ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
          <input
            type="checkbox"
            checked={quantity > 0}
            onChange={(e) => onQuantityChange(extra.id, e.target.checked ? 1 : 0)}
            disabled={loading || noneAvailable}
            className="w-5 h-5 rounded border-gray-300 cursor-pointer accent-[#0f3a5c]"
          />
          <div className="flex-1">
            <span className="font-medium text-gray-800">{extra.name}</span>
            {extra.description && (
              <p className="text-sm text-gray-500">{extra.description}</p>
            )}
          </div>
          <div className="text-right">
            {noneAvailable ? (
              <span className="text-sm font-medium text-red-500">None available</span>
            ) : (
              <>
                <span className="text-sm text-gray-500">{priceLabel}</span>
                {itemCost > 0 && (
                  <p className="text-sm font-semibold text-primary-700">+{formatCurrency(itemCost)}</p>
                )}
              </>
            )}
          </div>
        </label>
      </div>
    );
  }

  // Quantity selector for multi-item extras
  return (
    <div className={`border rounded-xl p-4 bg-white hover:shadow-sm transition-all ${noneAvailable ? 'border-gray-200 opacity-60' : 'border-gray-100'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <span className="font-medium text-gray-800">{extra.name}</span>
          {extra.description && (
            <p className="text-sm text-gray-500">{extra.description}</p>
          )}
        </div>
        {noneAvailable ? (
          <span className="text-sm font-medium text-red-500">None available</span>
        ) : (
          <span className="text-sm text-gray-500">{priceLabel}</span>
        )}
      </div>
      {!noneAvailable && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => onQuantityChange(extra.id, Math.max(0, quantity - 1))}
            disabled={loading || quantity <= 0}
            className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 font-medium text-gray-700 min-w-[40px]"
          >
            −
          </button>
          <span className="text-lg font-semibold w-8 text-center text-gray-900">
            {quantity}
          </span>
          <button
            onClick={() => onQuantityChange(extra.id, Math.min(effectiveMax, quantity + 1))}
            disabled={loading || quantity >= effectiveMax}
            className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 font-medium text-gray-700 min-w-[40px]"
          >
            +
          </button>
          {itemCost > 0 && (
            <span className="ml-auto text-sm font-semibold text-primary-700">
              +{formatCurrency(itemCost)}
              {isCapReached && quantity > 0 && (
                <span className="block text-xs font-normal text-amber-600">Price capped per set</span>
              )}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const ExtrasSelector = ({
  loading = false,
  numberOfDays,
  onChange,
  initialValues,
  extrasAvailability,
}: ExtrasSelectorProps) => {
  const [insuranceType, setInsuranceType] = useState<InsuranceType>(
    initialValues?.insuranceType ?? 'basic'
  );
  const [selectedExtras, setSelectedExtras] = useState<SelectedExtras>(
    initialValues?.selectedExtras ?? { cleaning_service: 1 }
  );

  const handleQuantityChange = (extraId: string, quantity: number) => {
    setSelectedExtras((prev) => ({
      ...prev,
      [extraId]: quantity,
    }));
  };

  useEffect(() => {
    onChange?.({ insuranceType, selectedExtras });
  }, [insuranceType, selectedExtras, onChange]);

  const categories = [
    { key: 'service', ...EXTRAS_BY_CATEGORY.service },
    { key: 'essentials', ...EXTRAS_BY_CATEGORY.essentials },
    { key: 'vehicle', ...EXTRAS_BY_CATEGORY.vehicle },
    { key: 'camping', ...EXTRAS_BY_CATEGORY.camping },
    { key: 'winter', ...EXTRAS_BY_CATEGORY.winter },
  ];

  return (
    <div className="space-y-8">

      {/* Included with the vehicle */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Included with the vehicle</h3>
        <div className="border border-gray-100 rounded-xl p-4 bg-white">
          <ul className="space-y-2">
            {[
              'Basic kitchen package',
              'Basic cleaning supplies',
              'General basic essentials (toilet paper, soap, paper towels)',
              'Minimum 11 kg of gas',
              'Bed linen for all beds',
              'Camping table and two camping chairs',
              'Awning',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-gray-700">
                <svg className="w-4 h-4 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Insurance Section */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Insurance</h3>
        <div className="border border-gray-100 rounded-xl p-4 bg-white space-y-2">
          {INSURANCE_OPTIONS.map((option) => {
            const isSelected = insuranceType === option.type;
            return (
              <div key={option.type}>
                <label
                  className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${isSelected ? 'bg-gray-50' : ''}`}
                >
                  <input
                    type="radio"
                    name="insurance"
                    value={option.type}
                    checked={isSelected}
                    onChange={() => setInsuranceType(option.type)}
                    disabled={loading}
                    className="w-5 h-5 cursor-pointer accent-[#0f3a5c]"
                  />
                  <span className="text-gray-800 flex-1 font-medium">{option.label}</span>
                  {option.price > 0 && (
                    <span className="text-sm text-gray-500">
                      {option.price} {CURRENCY.SYMBOL}/day
                    </span>
                  )}
                </label>
                {isSelected && option.details && (
                  <ul className="ml-11 mt-1 mb-2 space-y-1">
                    {option.details.map((detail: string) => {
                      const isNotCovered = detail.toLowerCase().includes('not covered') || detail.toLowerCase().includes('not included');
                      return (
                        <li key={detail} className={`text-sm flex items-start gap-2 ${isNotCovered ? 'text-red-600' : 'text-gray-600'}`}>
                          <span className={`mt-0.5 ${isNotCovered ? 'text-red-500' : 'text-gray-400'}`}>
                            {isNotCovered ? '✗' : '✓'}
                          </span>
                          <span>{detail}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Extras by Category */}
      {categories.map((category) => (
        <div key={category.key}>
          <h3 className="text-base font-semibold text-gray-900 mb-4">{category.title}</h3>
          <div className="space-y-3">
            {category.items.map((extra) => {
              const isExtraDriverFree = extra.id === 'extra_driver' && (insuranceType === 'premium' || insuranceType === 'premium_plus');
              return (
              <div key={extra.id}>
                <ExtraItem
                  extra={extra}
                  quantity={selectedExtras[extra.id] || 0}
                  numberOfDays={numberOfDays}
                  onQuantityChange={handleQuantityChange}
                  loading={loading}
                  isFreeWithInsurance={isExtraDriverFree}
                  availableStock={extra.globalMax !== undefined ? (extrasAvailability?.[extra.id] ?? extra.globalMax) : undefined}
                />
                {/* Airport pickup/dropoff warning when checked */}
                {(extra.id === 'airport_pickup' || extra.id === 'airport_dropoff') && !!selectedExtras[extra.id] && (
                  <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-amber-800">Did you know?</p>
                        <p className="text-sm text-amber-700 mt-1">
                          Taking a taxi directly to our location is often cheaper than this service. If you&apos;re looking to save, a taxi from Bergen Airport to our base typically costs less than 1,000 kr.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cleaning service info when checked */}
                {extra.id === 'cleaning_service' && !!selectedExtras[extra.id] && (
                  <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <p className="text-sm font-semibold text-blue-800 mb-2">What's included</p>
                    <ul className="space-y-1.5 text-sm text-blue-700">
                      <li className="flex items-start gap-2"><span className="mt-0.5 text-blue-400">✓</span> Full deep clean of the interior — floors, surfaces, kitchen, bathroom, and sleeping areas</li>
                      <li className="flex items-start gap-2"><span className="mt-0.5 text-blue-400">✓</span> Washing of all windows, mirrors, and fixtures</li>
                      <li className="flex items-start gap-2"><span className="mt-0.5 text-blue-400">✓</span> Sanitation of the toilet and waste systems</li>
                      <li className="flex items-start gap-2"><span className="mt-0.5 text-red-400">✗</span> The vehicle must still be returned in a reasonable condition — excessive dirt, food waste, or rubbish left behind is not covered</li>
                    </ul>
                    <p className="text-xs text-blue-600 mt-3 leading-relaxed">
                      Think of it like a hotel — housekeeping handles the deep clean, but guests are expected to leave the room reasonably tidy. If the vehicle requires extraordinary cleaning beyond normal use, an additional fee may apply.
                    </p>
                  </div>
                )}

                {/* Cleaning service warning when unchecked */}
                {extra.id === 'cleaning_service' && !selectedExtras[extra.id] && (
                  <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-amber-800">Cleaning fee warning</p>
                        <p className="text-sm text-amber-700 mt-1">
                          If the vehicle is not returned in the same clean condition as it was picked up,
                          you will be charged a <strong>cleaning fee of 1,500 kr</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
            })}
          </div>
        </div>
      ))}

    </div>
  );
};
