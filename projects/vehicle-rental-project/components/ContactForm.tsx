'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => void;
  loading?: boolean;
  initialData?: ContactFormData;
}

export const ContactForm = ({
  onSubmit,
  loading = false,
  initialData,
}: ContactFormProps) => {
  const [formData, setFormData] = useState<ContactFormData>(
    initialData || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    }
  );

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [agreedToTos, setAgreedToTos] = useState(false);
  const [tosError, setTosError] = useState<string | null>(null);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [privacyError, setPrivacyError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';

    if (!agreedToTos) {
      setTosError('You must agree to the Terms and Conditions');
    } else {
      setTosError(null);
    }

    if (!agreedToPrivacy) {
      setPrivacyError('You must accept the Privacy Policy to proceed');
    } else {
      setPrivacyError(null);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && agreedToTos && agreedToPrivacy;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 bg-white border rounded-lg transition-colors duration-200 focus:outline-none ${
              errors.firstName ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-100' : 'border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-100'
            }`}
            placeholder="John"
            disabled={loading}
          />
          {errors.firstName && (
            <span className="text-red-600 text-xs mt-1.5 block">{errors.firstName}</span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 bg-white border rounded-lg transition-colors duration-200 focus:outline-none ${
              errors.lastName ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-100' : 'border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-100'
            }`}
            placeholder="Doe"
            disabled={loading}
          />
          {errors.lastName && (
            <span className="text-red-600 text-xs mt-1.5 block">{errors.lastName}</span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 bg-white border rounded-lg transition-colors duration-200 focus:outline-none ${
            errors.email ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-100' : 'border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-100'
          }`}
          placeholder="john@example.com"
          disabled={loading}
        />
        {errors.email && (
          <span className="text-red-600 text-xs mt-1.5 block">{errors.email}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 bg-white border rounded-lg transition-colors duration-200 focus:outline-none ${
            errors.phone ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-100' : 'border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-100'
          }`}
          placeholder="+1 (555) 000-0000"
          disabled={loading}
        />
        {errors.phone && (
          <span className="text-red-600 text-xs mt-1.5 block">{errors.phone}</span>
        )}
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="tos"
          checked={agreedToTos}
          onChange={(e) => {
            setAgreedToTos(e.target.checked);
            if (e.target.checked) setTosError(null);
          }}
          className={`mt-1 w-4 h-4 rounded border-primary-300 text-primary-600 focus:ring-primary-500 ${
            tosError ? 'border-red-400' : ''
          }`}
          disabled={loading}
        />
        <div>
          <label htmlFor="tos" className="text-sm text-gray-700">
            I have read and agree to the{' '}
            <Link
              href="/toc"
              target="_blank"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              Terms and Conditions
            </Link>
          </label>
          {tosError && (
            <span className="text-red-600 text-xs mt-1 block">{tosError}</span>
          )}
        </div>
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="privacy"
          checked={agreedToPrivacy}
          onChange={(e) => {
            setAgreedToPrivacy(e.target.checked);
            if (e.target.checked) setPrivacyError(null);
          }}
          className={`mt-1 w-4 h-4 rounded border-primary-300 text-primary-600 focus:ring-primary-500 ${
            privacyError ? 'border-red-400' : ''
          }`}
          disabled={loading}
        />
        <div>
          <label htmlFor="privacy" className="text-sm text-gray-700">
            I have read and agree to the{' '}
            <Link
              href="/privacy"
              target="_blank"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              Privacy Policy
            </Link>
            {' '}and consent to the processing of my personal data
          </label>
          {privacyError && (
            <span className="text-red-600 text-xs mt-1 block">{privacyError}</span>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 border-2 border-gray-900 text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed font-semibold rounded-lg transition-all duration-200 hover:bg-gray-900 hover:text-white hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {loading && (
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {loading ? 'Submitting...' : 'Continue to Extras'}
      </button>
    </form>
  );
};
