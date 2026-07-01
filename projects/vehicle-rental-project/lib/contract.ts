import { getExtraById, PRICING } from '@/lib/constants';

export interface ContractDriver {
  id?: number;
  full_name: string;
  date_of_birth: string;
  license_number: string;
  license_expiry: string;
  license_country: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code: string;
  country: string;
  is_primary: boolean;
}

export interface ContractBooking {
  id: number;
  order_id?: string;
  upload_token?: string;
  vehicle_name?: string;
  vehicle_license_plate?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  start_date: string;
  end_date: string;
  total_price: string | number;
  insurance_type?: string;
  selected_extras?: Record<string, number>;
  created_at: string;
}

const COMPANY_INFO = {
  name: 'NorthVenture',
  address: 'Ropnesvegen 43, 9107 Bergen, Norway',
  phone: '+47 555 12 345',
  email: 'hello@northventure-demo.com',
  website: 'arctictrail.no',
};

export function generateContractHTML(booking: ContractBooking, drivers: ContractDriver[]): string {
  const extras = (booking.selected_extras || {}) as Record<string, number>;
  const extraEntries = Object.entries(extras).filter(([, qty]) => Number(qty) > 0);

  const startDate = new Date(booking.start_date);
  const endDate = new Date(booking.end_date);
  const totalPrice = typeof booking.total_price === 'string' ? parseFloat(booking.total_price) : booking.total_price;

  const extrasHtml = extraEntries.length > 0
    ? extraEntries.map(([id, qty]) => {
        const extra = getExtraById(id);
        return `<tr><td>${extra?.name || id}</td><td style="text-align:center;">${qty}</td></tr>`;
      }).join('')
    : '<tr><td colspan="2" style="color:#6b7280;">No extras selected</td></tr>';

  const insuranceKey = (booking.insurance_type?.toUpperCase().replace('-', '_') || 'BASIC') as keyof typeof PRICING.INSURANCE;
  const deposit = PRICING.INSURANCE[insuranceKey]?.deposit ?? PRICING.INSURANCE.BASIC.deposit;

  const primaryDriver = drivers.find((d) => d.is_primary);
  const additionalDrivers = drivers.filter((d) => !d.is_primary);

  const formatDate = (date: Date) => date.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Rental Agreement - ${booking.order_id || '#' + booking.id}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #111827; max-width: 800px; margin: 0 auto; font-size: 12px; line-height: 1.5; }
          .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #1e3a8a; }
          .header h1 { font-size: 28px; color: #1e3a8a; margin-bottom: 5px; }
          .header h2 { font-size: 20px; color: #374151; font-weight: 600; margin-top: 10px; }
          .header .contract-id { font-size: 11px; color: #6b7280; margin-top: 10px; }
          .intro { margin-bottom: 25px; font-style: italic; color: #4b5563; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 13px; font-weight: 700; color: #1e3a8a; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #e5e7eb; text-transform: uppercase; letter-spacing: 0.5px; }
          .field-row { display: flex; margin-bottom: 8px; }
          .field-label { color: #6b7280; min-width: 180px; }
          .field-value { font-weight: 600; color: #111827; flex: 1; border-bottom: 1px dotted #d1d5db; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 30px; }
          .info-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px dotted #e5e7eb; }
          .info-row .label { color: #6b7280; }
          .info-row .value { font-weight: 600; color: #111827; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          table th, table td { padding: 6px 10px; text-align: left; border: 1px solid #e5e7eb; }
          table th { background: #f3f4f6; font-weight: 600; color: #374151; }
          .driver-box { background: #f9fafb; border: 1px solid #e5e7eb; padding: 12px; margin-bottom: 10px; border-radius: 4px; }
          .driver-badge { display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 3px; background: #dbeafe; color: #1e40af; margin-bottom: 8px; }
          .signature-section { margin-top: 40px; page-break-inside: avoid; }
          .signature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 20px; }
          .signature-box { padding-top: 8px; }
          .signature-box .sig-label { font-size: 11px; color: #6b7280; margin-bottom: 5px; }
          .signature-box .sig-line { height: 40px; border-bottom: 1px solid #111827; margin-bottom: 5px; }
          .footer { margin-top: 30px; text-align: center; font-size: 9px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 15px; }
          .highlight { background: #fef3c7; padding: 10px; border-radius: 4px; margin: 15px 0; font-size: 11px; }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${COMPANY_INFO.name}</h1>
          <h2>VEHICLE RENTAL AGREEMENT</h2>
          <div class="contract-id">Order ID: ${booking.order_id || 'AT-' + booking.id}${booking.upload_token ? ` &nbsp;|&nbsp; Booking ID: ${booking.upload_token}` : ''} &nbsp;|&nbsp; Created: ${new Date().toLocaleDateString('en-GB')}</div>
        </div>

        <p class="intro">This agreement is entered into between ${COMPANY_INFO.name} (Lessor) and the Renter.</p>

        <div class="section">
          <div class="section-title">1. Rental Vehicle</div>
          <div class="field-row">
            <span class="field-label">Make/Model:</span>
            <span class="field-value">${booking.vehicle_name || '_______________'}</span>
          </div>
          <div class="field-row">
            <span class="field-label">Registration Number:</span>
            <span class="field-value">${booking.vehicle_license_plate || '_______________'}</span>
          </div>
          <div class="field-row">
            <span class="field-label">Odometer at Pickup:</span>
            <span class="field-value">_______________</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">2. Rental Period</div>
          <div class="field-row">
            <span class="field-label">From Date/Time:</span>
            <span class="field-value">${formatDate(startDate)}</span>
          </div>
          <div class="field-row">
            <span class="field-label">To Date/Time:</span>
            <span class="field-value">${formatDate(endDate)}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">3. Price and Payment</div>
          <div class="field-row">
            <span class="field-label">Rental Price:</span>
            <span class="field-value">${totalPrice.toLocaleString('nb-NO', { minimumFractionDigits: 2 })} NOK</span>
          </div>
          <div class="field-row">
            <span class="field-label">Deposit:</span>
            <span class="field-value">${deposit.toLocaleString('nb-NO')} NOK</span>
          </div>
          <p style="margin-top: 10px; color: #4b5563; font-size: 11px;">
            The deposit will be refunded after the rental period, less any applicable costs.
          </p>
        </div>

        <div class="section">
          <div class="section-title">4. Insurance and Liability</div>
          <div class="field-row">
            <span class="field-label">Insurance Type:</span>
            <span class="field-value">${(booking.insurance_type || 'basic').replace('_', ' ').toUpperCase()}</span>
          </div>
          <p style="margin-top: 10px; color: #374151;">
            The Renter is responsible for the vehicle throughout the rental period, including:
          </p>
          <ul style="margin: 10px 0 0 20px; color: #374151;">
            <li>Damages and loss</li>
            <li>Fines, tolls, and fees</li>
            <li>Insurance deductible in case of damage</li>
          </ul>
        </div>

        <div class="section">
          <div class="section-title">5. General Terms</div>
          <p style="color: #374151;">
            This agreement is governed by ${COMPANY_INFO.name}'s terms and conditions published at:<br>
            <a href="https://www.${COMPANY_INFO.website}/toc" style="color: #1e40af;">https://www.${COMPANY_INFO.website}/toc</a>
          </p>
          <div class="highlight">
            <strong>By signing below, the Renter confirms that the terms and conditions have been read and accepted.</strong>
          </div>
        </div>

        <div class="section">
          <div class="section-title">6. Vehicle Use</div>
          <p style="color: #374151;">
            The vehicle shall not be used for illegal purposes, competitions, or by a driver without a valid driver's license.
          </p>
        </div>

        <div class="section">
          <div class="section-title">7. Return of Vehicle</div>
          <p style="color: #374151; margin-bottom: 8px;">
            <strong>The vehicle must be returned by 12:00 (noon) on the return date</strong>, unless a Late Return upgrade (until 18:00) has been added to the booking.
          </p>
          <p style="color: #374151; margin-bottom: 8px;">
            For every started 30-minute period after the agreed return time, a fee of <strong>400 NOK</strong> will be charged.
          </p>
          <p style="color: #374151;">
            The vehicle must be returned in the same condition as at pickup (normal wear and tear excepted).
          </p>
        </div>

        <div class="section">
          <div class="section-title">8. Governing Law</div>
          <p style="color: #374151;">
            This agreement is governed by Norwegian law.
          </p>
        </div>

        ${extraEntries.length > 0 ? `
        <div class="section">
          <div class="section-title">Extras</div>
          <table>
            <thead><tr><th>Item</th><th style="width:80px;text-align:center;">Qty</th></tr></thead>
            <tbody>${extrasHtml}</tbody>
          </table>
        </div>
        ` : ''}

        <div class="section">
          <div class="section-title">Driver Information</div>
          ${primaryDriver ? `
            <div class="driver-box">
              <div class="driver-badge">PRIMARY DRIVER</div>
              <div class="info-grid">
                <div class="info-row"><span class="label">Full Name</span><span class="value">${primaryDriver.full_name}</span></div>
                <div class="info-row"><span class="label">Date of Birth</span><span class="value">${new Date(primaryDriver.date_of_birth).toLocaleDateString('en-GB')}</span></div>
                <div class="info-row"><span class="label">License Number</span><span class="value">${primaryDriver.license_number}</span></div>
                <div class="info-row"><span class="label">License Expiry</span><span class="value">${new Date(primaryDriver.license_expiry).toLocaleDateString('en-GB')}</span></div>
                <div class="info-row"><span class="label">License Country</span><span class="value">${primaryDriver.license_country}</span></div>
                <div class="info-row"><span class="label">Address</span><span class="value">${primaryDriver.address_line1}</span></div>
                ${primaryDriver.address_line2 ? `<div class="info-row"><span class="label">Address Line 2</span><span class="value">${primaryDriver.address_line2}</span></div>` : ''}
                <div class="info-row"><span class="label">Postal Code</span><span class="value">${primaryDriver.postal_code}</span></div>
                <div class="info-row"><span class="label">City</span><span class="value">${primaryDriver.city}</span></div>
                <div class="info-row"><span class="label">Country</span><span class="value">${primaryDriver.country}</span></div>
              </div>
            </div>
          ` : '<p style="color:#6b7280;font-style:italic;">Driver information not yet submitted.</p>'}
          ${additionalDrivers.map((d) => `
            <div class="driver-box">
              <div class="driver-badge">ADDITIONAL DRIVER</div>
              <div class="info-grid">
                <div class="info-row"><span class="label">Full Name</span><span class="value">${d.full_name}</span></div>
                <div class="info-row"><span class="label">Date of Birth</span><span class="value">${new Date(d.date_of_birth).toLocaleDateString('en-GB')}</span></div>
                <div class="info-row"><span class="label">License Number</span><span class="value">${d.license_number}</span></div>
                <div class="info-row"><span class="label">License Expiry</span><span class="value">${new Date(d.license_expiry).toLocaleDateString('en-GB')}</span></div>
                <div class="info-row"><span class="label">License Country</span><span class="value">${d.license_country}</span></div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="signature-section">
          <div class="section-title">Signatures</div>

          <div class="field-row" style="margin-bottom: 20px;">
            <span class="field-label">Place/Date:</span>
            <span class="field-value">_______________</span>
          </div>

          <div class="signature-grid">
            <div class="signature-box">
              <div class="sig-label">Lessor (${COMPANY_INFO.name})</div>
              <div class="sig-line"></div>
            </div>
            <div class="signature-box">
              <div class="sig-label">Renter</div>
              <div class="sig-line"></div>
            </div>
          </div>

          ${additionalDrivers.length > 0 ? `
            <p style="margin-top: 25px; margin-bottom: 15px; color: #6b7280;">Additional Drivers:</p>
            <div class="signature-grid">
              ${additionalDrivers.map((d) => `
                <div class="signature-box">
                  <div class="sig-label">${d.full_name}</div>
                  <div class="sig-line"></div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div class="footer">
          <p><strong>${COMPANY_INFO.name}</strong> | ${COMPANY_INFO.address}</p>
          <p>Phone: ${COMPANY_INFO.phone} | Email: ${COMPANY_INFO.email} | Web: ${COMPANY_INFO.website}</p>
        </div>
      </body>
    </html>
  `;
}
