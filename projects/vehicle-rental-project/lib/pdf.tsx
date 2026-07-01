import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';
import { ALL_EXTRAS, INSURANCE_OPTIONS, INSURANCE_PRICES, PRICING, COMPANY_PHONE, COMPANY_EMAIL, COMPANY_WEBSITE } from './constants';
import type { ContractBooking, ContractDriver } from './contract';

const PRIMARY = '#1e3a8a';
const TEAL = '#0f766e';
const GRAY_TEXT = '#6b7280';
const DARK_TEXT = '#111827';
const BORDER = '#e5e7eb';
const BG_LIGHT = '#f9fafb';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: DARK_TEXT,
    paddingTop: 0,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: PRIMARY,
    padding: '32 40',
    marginBottom: 0,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
  },
  headerSubtitle: {
    color: '#bfdbfe',
    fontSize: 11,
    marginTop: 4,
  },
  body: {
    padding: '28 40',
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: DARK_TEXT,
    marginBottom: 10,
    marginTop: 20,
  },
  card: {
    backgroundColor: BG_LIGHT,
    borderRadius: 6,
    padding: '16 20',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  rowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  label: {
    color: GRAY_TEXT,
    fontSize: 10,
    width: 140,
  },
  value: {
    color: DARK_TEXT,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    flex: 1,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginTop: 6,
    borderTopWidth: 2,
    borderTopColor: BORDER,
  },
  totalLabel: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: DARK_TEXT,
  },
  totalValue: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
  },
  infoBox: {
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
    backgroundColor: '#eff6ff',
    padding: '10 14',
    marginBottom: 16,
    borderRadius: 4,
  },
  infoBoxText: {
    color: '#1e40af',
    fontSize: 10,
    lineHeight: 1.5,
  },
  greenBox: {
    borderLeftWidth: 3,
    borderLeftColor: '#22c55e',
    backgroundColor: '#f0fdf4',
    padding: '10 14',
    marginBottom: 16,
    borderRadius: 4,
  },
  greenBoxText: {
    color: '#166534',
    fontSize: 10,
    lineHeight: 1.5,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bullet: {
    width: 14,
    color: GRAY_TEXT,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    color: DARK_TEXT,
    fontSize: 10,
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    color: GRAY_TEXT,
    fontSize: 9,
  },
});

const formatInsuranceLabel = (type: string): string => {
  const opt = INSURANCE_OPTIONS.find(o => o.type === type);
  return opt?.label ?? type;
};

const formatExtras = (extras: Record<string, number>): string => {
  const parts: string[] = [];
  for (const [id, qty] of Object.entries(extras)) {
    if (qty <= 0) continue;
    const extra = ALL_EXTRAS.find(e => e.id === id);
    if (!extra) continue;
    parts.push(qty > 1 ? `${extra.name} x${qty}` : extra.name);
  }
  return parts.length > 0 ? parts.join(', ') : 'None';
};

const formatPrice = (n: number) =>
  n.toLocaleString('nb-NO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, '\u00a0') + ' kr';

// ─── Row helpers ──────────────────────────────────────────────────────────────

const TableRow = ({ label, value, last = false }: { label: string; value: string; last?: boolean }) => (
  <View style={last ? styles.rowLast : styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const TotalRow = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <View style={styles.totalRow}>
    <Text style={styles.totalLabel}>{label}</Text>
    <Text style={[styles.totalValue, { color }]}>{value}</Text>
  </View>
);


// ─── Booking Confirmation Document ───────────────────────────────────────────

interface ConfirmationData {
  bookingId?: number;
  uploadToken?: string;
  orderId?: string;
  customerName: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  insurance?: string;
  selectedExtras?: Record<string, number>;
  babySeats?: number;
  extraDriver?: boolean;
  totalPrice: number;
}

interface LineItem { name: string; detail: string; amount: number }

const parseDateStr = (d: string): Date => {
  // Handles both DD.MM.YYYY (Norwegian formatted) and ISO YYYY-MM-DD
  if (d.includes('.')) {
    const [day, month, year] = d.split('.');
    return new Date(`${year}-${month}-${day}`);
  }
  return new Date(d);
};

const buildLineItems = (data: ConfirmationData, days: number): LineItem[] => {
  const lines: LineItem[] = [];

  if (data.selectedExtras) {
    for (const [id, qty] of Object.entries(data.selectedExtras)) {
      if (qty <= 0) continue;
      const extra = ALL_EXTRAS.find(e => e.id === id);
      if (!extra) continue;
      let amount = 0;
      let detail = '';
      if (extra.priceType === 'per_day') {
        const perItem = extra.maxPrice ? Math.min(extra.price * days, extra.maxPrice) : extra.price * days;
        amount = perItem * qty;
        detail = qty > 1 ? `${qty}× · ${extra.price} kr/day` : `${extra.price} kr/day`;
      } else {
        amount = extra.price * qty;
        detail = qty > 1 ? `${qty}×` : '';
      }
      lines.push({ name: extra.name, detail, amount });
    }
  }
  if (data.babySeats) {
    lines.push({ name: `Baby Seats x${data.babySeats}`, detail: `${PRICING.BABY_SEAT_PRICE} kr/day`, amount: PRICING.BABY_SEAT_PRICE * data.babySeats * days });
  }
  if (data.extraDriver) {
    lines.push({ name: 'Extra Driver', detail: `${PRICING.EXTRA_DRIVER_PRICE} kr/day`, amount: PRICING.EXTRA_DRIVER_PRICE * days });
  }
  return lines;
};

const InvoiceRow = ({ name, detail, amount, isHeader = false }: { name: string; detail: string; amount: string; isHeader?: boolean }) => (
  <View style={{ flexDirection: 'row', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: BORDER }}>
    <Text style={{ flex: 3, color: isHeader ? GRAY_TEXT : DARK_TEXT, fontSize: isHeader ? 9 : 10, fontFamily: isHeader ? 'Helvetica' : 'Helvetica' }}>{name}</Text>
    <Text style={{ flex: 2, color: GRAY_TEXT, fontSize: 9, textAlign: 'center' }}>{detail}</Text>
    <Text style={{ flex: 1, color: isHeader ? GRAY_TEXT : DARK_TEXT, fontSize: isHeader ? 9 : 10, fontFamily: 'Helvetica-Bold', textAlign: 'right' }}>{amount}</Text>
  </View>
);

const BookingConfirmationDoc = ({ data }: { data: ConfirmationData }) => {
  const days = Math.round((parseDateStr(data.endDate).getTime() - parseDateStr(data.startDate).getTime()) / (1000 * 60 * 60 * 24));
  const insurancePricePerDay = data.insurance ? (INSURANCE_PRICES[data.insurance] ?? 0) : 0;
  const insuranceTotal = insurancePricePerDay * days;
  const insuranceOption = Object.values(PRICING.INSURANCE).find(o => o.type === data.insurance) ?? PRICING.INSURANCE.BASIC;
  const deposit = insuranceOption.deposit;
  const extraLines = buildLineItems(data, days);
  const extrasTotal = extraLines.reduce((s, l) => s + l.amount, 0);
  const vehiclePrice = data.totalPrice - extrasTotal - insuranceTotal;
  const mva = data.totalPrice - data.totalPrice / 1.25;
  const insuranceLabel = data.insurance ? formatInsuranceLabel(data.insurance) : null;
  const today = new Date().toLocaleDateString('nb-NO', { year: 'numeric', month: '2-digit', day: '2-digit' });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Arctic Trail</Text>
          <Text style={styles.headerSubtitle}>Booking Invoice</Text>
        </View>

        <View style={styles.body}>
          {/* Invoice meta */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
            <View>
              <Text style={{ color: GRAY_TEXT, fontSize: 9, marginBottom: 3 }}>BILLED TO</Text>
              <Text style={{ color: DARK_TEXT, fontSize: 11, fontFamily: 'Helvetica-Bold' }}>{data.customerName}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: GRAY_TEXT, fontSize: 9 }}>Issued: {today}</Text>
              {data.orderId && (
                <Text style={{ color: GRAY_TEXT, fontSize: 9, marginTop: 2 }}>Order ID: {data.orderId}</Text>
              )}
              {data.uploadToken && (
                <Text style={{ color: GRAY_TEXT, fontSize: 9, marginTop: 1 }}>Booking ID: {data.uploadToken}</Text>
              )}
            </View>
          </View>

          {/* Date + vehicle card */}
          <View style={styles.card}>
            <TableRow label="Vehicle:" value={data.vehicleName} />
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              <View style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: 4, padding: '10 12', borderWidth: 1, borderColor: BORDER }}>
                <Text style={{ color: GRAY_TEXT, fontSize: 8, fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>CHECK-IN</Text>
                <Text style={{ color: DARK_TEXT, fontSize: 12, fontFamily: 'Helvetica-Bold' }}>{data.startDate}</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: 4, padding: '10 12', borderWidth: 1, borderColor: BORDER }}>
                <Text style={{ color: GRAY_TEXT, fontSize: 8, fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>CHECK-OUT</Text>
                <Text style={{ color: DARK_TEXT, fontSize: 12, fontFamily: 'Helvetica-Bold' }}>{data.endDate}</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: 4, padding: '10 12', borderWidth: 1, borderColor: BORDER }}>
                <Text style={{ color: GRAY_TEXT, fontSize: 8, fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>DURATION</Text>
                <Text style={{ color: DARK_TEXT, fontSize: 12, fontFamily: 'Helvetica-Bold' }}>{days} days</Text>
              </View>
            </View>
          </View>

          {/* Line items */}
          <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>Invoice Breakdown</Text>
          <View style={styles.card}>
            <InvoiceRow name="Description" detail="Details" amount="Amount" isHeader />
            <InvoiceRow
              name={data.vehicleName}
              detail={`${days} days`}
              amount={formatPrice(vehiclePrice)}
            />
            {insuranceLabel && insuranceTotal > 0 && (
              <InvoiceRow
                name={`Insurance — ${insuranceLabel}`}
                detail={`${days} days · ${insurancePricePerDay} kr/day`}
                amount={formatPrice(insuranceTotal)}
              />
            )}
            {extraLines.map((line, i) => (
              <InvoiceRow key={i} name={line.name} detail={line.detail} amount={formatPrice(line.amount)} />
            ))}
            {/* MVA + Total */}
            <View style={{ borderTopWidth: 2, borderTopColor: BORDER, paddingTop: 8, marginTop: 4 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ color: GRAY_TEXT, fontSize: 10 }}>Herav MVA 25%:</Text>
                <Text style={{ color: GRAY_TEXT, fontSize: 10 }}>{formatPrice(mva)}</Text>
              </View>
            </View>
            <TotalRow label="Total" value={formatPrice(data.totalPrice)} color={PRIMARY} />
          </View>

          {/* Security Deposit */}
          <View style={[styles.infoBox, { borderLeftColor: '#f59e0b', backgroundColor: '#fef3c7' }]}>
            <Text style={[styles.infoBoxText, { color: '#92400e', fontFamily: 'Helvetica-Bold', marginBottom: 3 }]}>
              Security Deposit: {formatPrice(deposit)}
            </Text>
            <Text style={[styles.infoBoxText, { color: '#92400e' }]}>
              A pre-authorisation of {formatPrice(deposit)} will be held on your payment card at pickup and released after the vehicle is returned undamaged.
            </Text>
          </View>

          {/* Cancellation Policy */}
          <View wrap={false}>
            <Text style={styles.sectionTitle}>Cancellation Policy</Text>
            <View style={styles.card}>
              <TableRow label="Within 24h of booking:" value="100% refund (free cancellation)" />
              <TableRow label="More than 30 days before:" value="100% refund" />
              <TableRow label="22–30 days before:" value="50% refund" />
              <TableRow label="15–21 days before:" value="25% refund" />
              <TableRow label="14 days or less:" value="No refund" last />
            </View>
          </View>

          {/* Contact */}
          <View style={styles.card}>
            <Text style={[styles.sectionTitle, { marginTop: 0, marginBottom: 10, fontSize: 11 }]}>Contact Us</Text>
            <TableRow label="Email:" value={COMPANY_EMAIL} />
            <TableRow label="Phone:" value={COMPANY_PHONE} />
            <TableRow label="Website:" value={COMPANY_WEBSITE} last />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Arctic Trail — northventure-demo.com · Foretaksregisteret: NO 992 734 906 MVA</Text>
          <Text style={styles.footerText}>{data.vehicleName} · {data.startDate} – {data.endDate}</Text>
        </View>
      </Page>
    </Document>
  );
};

// ─── Booking Updated Document ─────────────────────────────────────────────────

interface UpdateData {
  bookingId: number;
  uploadToken?: string;
  orderId?: string;
  customerName: string;
  vehicleName: string;
  oldStartDate: string;
  oldEndDate: string;
  newStartDate: string;
  newEndDate: string;
  oldTotalPrice: number;
  newTotalPrice: number;
  priceDiff: number;
  refundAmount?: number;
  refundPercentage?: number;
  oldInsuranceType?: string;
  newInsuranceType?: string;
  oldSelectedExtras?: Record<string, number>;
  newSelectedExtras?: Record<string, number>;
}

const BookingUpdatedDoc = ({ data }: { data: UpdateData }) => {
  const isExtrasChange = data.newInsuranceType !== undefined || data.newSelectedExtras !== undefined;
  const hasSurcharge = data.priceDiff > 0;
  const hasRefund = (data.refundAmount ?? 0) > 0;

  const oldInsuranceLabel = data.oldInsuranceType ? formatInsuranceLabel(data.oldInsuranceType) : null;
  const newInsuranceLabel = data.newInsuranceType ? formatInsuranceLabel(data.newInsuranceType) : null;
  const insuranceChanged = oldInsuranceLabel && newInsuranceLabel && oldInsuranceLabel !== newInsuranceLabel;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: TEAL }]}>
          <Text style={styles.headerTitle}>Arctic Trail</Text>
          <Text style={styles.headerSubtitle}>Booking Updated</Text>
        </View>

        <View style={styles.body}>
          <Text style={[styles.sectionTitle, { marginTop: 0 }]}>Your booking has been updated</Text>
          <Text style={{ color: GRAY_TEXT, fontSize: 10, marginBottom: 16, lineHeight: 1.5 }}>
            Hi {data.customerName}, here's a summary of the changes made to your booking.
          </Text>

          {/* Booking Details */}
          <View style={styles.card}>
            <Text style={[styles.sectionTitle, { marginTop: 0, fontSize: 11 }]}>Booking Details</Text>
            {data.orderId && <TableRow label="Order ID:" value={data.orderId} />}
            {data.uploadToken && <TableRow label="Booking ID:" value={data.uploadToken} />}
            <TableRow label="Vehicle:" value={data.vehicleName} />
            {isExtrasChange ? (
              <TableRow label="Dates:" value={`${data.newStartDate} – ${data.newEndDate}`} />
            ) : (
              <>
                <TableRow label="Previous dates:" value={`${data.oldStartDate} – ${data.oldEndDate}`} />
                <TableRow label="New check-in:" value={data.newStartDate} />
                <TableRow label="New check-out:" value={data.newEndDate} />
              </>
            )}
            <TableRow label="Herav MVA 25%:" value={formatPrice(data.newTotalPrice - data.newTotalPrice / 1.25)} last />
            <TotalRow label="New Total:" value={formatPrice(data.newTotalPrice)} color={TEAL} />
          </View>

          {/* What Changed (extras only) */}
          {isExtrasChange && (
            <>
              <Text style={styles.sectionTitle}>What Changed</Text>
              <View style={styles.card}>
                {insuranceChanged && (
                  <TableRow label="Insurance:" value={`${oldInsuranceLabel} → ${newInsuranceLabel}`} />
                )}
                {data.oldSelectedExtras && (
                  <TableRow label="Extras before:" value={formatExtras(data.oldSelectedExtras)} />
                )}
                {data.newSelectedExtras && (
                  <TableRow label="Extras after:" value={formatExtras(data.newSelectedExtras)} last />
                )}
              </View>
            </>
          )}

          {/* Refund info */}
          {hasRefund && (
            <View style={styles.greenBox}>
              <Text style={styles.greenBoxText}>
                Refund of {formatPrice(data.refundAmount!)} ({data.refundPercentage}%) will be processed within 3–5 business days to your original payment method.
              </Text>
            </View>
          )}

          {/* Surcharge info */}
          {hasSurcharge && !hasRefund && (
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxText}>
                An additional charge of {formatPrice(data.priceDiff)} has been applied.
              </Text>
            </View>
          )}

          {/* Contact */}
          <Text style={{ color: GRAY_TEXT, fontSize: 10, marginTop: 8 }}>
            Questions? Contact us at hello@northventure-demo.com
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Arctic Trail — northventure-demo.com · Foretaksregisteret: NO 992 734 906 MVA</Text>
          <Text style={styles.footerText}>{data.vehicleName} · {data.newStartDate} – {data.newEndDate}</Text>
        </View>
      </Page>
    </Document>
  );
};

// ─── Admin New Booking Document ───────────────────────────────────────────────

interface AdminNewBookingData {
  bookingId?: number;
  uploadToken?: string;
  orderId?: string;
  customerName: string;
  customerEmail: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  pickupTime?: string;
  insurance?: string;
  selectedExtras?: Record<string, number>;
  babySeats?: number;
  extraDriver?: boolean;
  totalPrice: number;
}

const AdminNewBookingDoc = ({ data }: { data: AdminNewBookingData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={[styles.header, { backgroundColor: '#10b981' }]}>
        <Text style={styles.headerTitle}>Arctic Trail</Text>
        <Text style={styles.headerSubtitle}>New Booking</Text>
      </View>

      <View style={styles.body}>
        <Text style={[styles.sectionTitle, { marginTop: 0 }]}>Customer Information</Text>
        <View style={styles.card}>
          <TableRow label="Name:" value={data.customerName} />
          <TableRow label="Email:" value={data.customerEmail} last />
        </View>

        <Text style={styles.sectionTitle}>Booking Details</Text>
        <View style={styles.card}>
          {data.orderId && <TableRow label="Order ID:" value={data.orderId} />}
          {data.uploadToken && <TableRow label="Booking ID:" value={data.uploadToken} />}
          <TableRow label="Vehicle:" value={data.vehicleName} />
          <TableRow label="Check-in:" value={data.startDate} />
          {data.pickupTime && <TableRow label="Pickup time:" value={data.pickupTime} />}
          <TableRow label="Check-out:" value={data.endDate} />
          {data.insurance && <TableRow label="Insurance:" value={formatInsuranceLabel(data.insurance)} />}
          {data.selectedExtras && <TableRow label="Extras:" value={formatExtras(data.selectedExtras)} />}
          {data.babySeats ? <TableRow label="Baby Seats:" value={`${data.babySeats}x`} /> : null}
          {data.extraDriver ? <TableRow label="Extra Driver:" value="Yes" /> : null}
          <TableRow label="Herav MVA 25%:" value={formatPrice(data.totalPrice - data.totalPrice / 1.25)} last />
          <TotalRow label="Total:" value={formatPrice(data.totalPrice)} color="#10b981" />
        </View>
      </View>

      <View style={styles.footer} fixed>
        <Text style={styles.footerText}>Arctic Trail — northventure-demo.com · Foretaksregisteret: NO 992 734 906 MVA</Text>
        <Text style={styles.footerText}>{data.vehicleName} · {data.startDate} – {data.endDate}</Text>
      </View>
    </Page>
  </Document>
);

// ─── Cancellation Document ────────────────────────────────────────────────────

interface CancellationPdfData {
  bookingId: number;
  orderId?: string;
  uploadToken?: string;
  customerName: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  refundAmount: number;
  refundPercentage: number;
  daysUntilStart: number;
  reason?: string;
  cancelledBy?: 'customer' | 'admin';
}

const CancellationDoc = ({ data }: { data: CancellationPdfData }) => {
  const hasRefund = data.refundAmount > 0;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.header, { backgroundColor: '#6b7280' }]}>
          <Text style={styles.headerTitle}>Arctic Trail</Text>
          <Text style={styles.headerSubtitle}>Booking Cancellation</Text>
        </View>

        <View style={styles.body}>
          <Text style={[styles.sectionTitle, { marginTop: 0 }]}>Booking Cancelled</Text>
          <Text style={{ color: GRAY_TEXT, fontSize: 10, marginBottom: 16, lineHeight: 1.5 }}>
            Hi {data.customerName}, your booking has been cancelled.
          </Text>

          <View style={[styles.card, { borderLeftWidth: 3, borderLeftColor: '#ef4444', backgroundColor: '#fef2f2' }]}>
            <Text style={[styles.sectionTitle, { marginTop: 0, fontSize: 11, color: '#991b1b' }]}>Cancelled Booking</Text>
            {data.orderId && <TableRow label="Order ID:" value={data.orderId} />}
            {data.uploadToken && <TableRow label="Booking ID:" value={data.uploadToken} />}
            <TableRow label="Vehicle:" value={data.vehicleName} />
            <TableRow label="Check-in:" value={data.startDate} />
            <TableRow label="Check-out:" value={data.endDate} />
            <TableRow label="Original Total:" value={formatPrice(data.totalPrice)} last />
          </View>

          <Text style={styles.sectionTitle}>Refund Information</Text>
          <View style={hasRefund ? styles.greenBox : [styles.infoBox, { borderLeftColor: '#f59e0b', backgroundColor: '#fef3c7' }]}>
            <Text style={hasRefund ? styles.greenBoxText : [styles.infoBoxText, { color: '#92400e' }]}>
              {`Days until start: ${data.daysUntilStart}\nRefund percentage: ${data.refundPercentage}%\nRefund amount: ${formatPrice(data.refundAmount)}`}
            </Text>
          </View>

          {data.reason ? (
            <View style={styles.card}>
              <Text style={[styles.label, { marginBottom: 4 }]}>Cancellation Reason:</Text>
              <Text style={{ color: DARK_TEXT, fontSize: 10, lineHeight: 1.5 }}>{data.reason}</Text>
            </View>
          ) : null}

          {data.cancelledBy && (
            <Text style={{ color: GRAY_TEXT, fontSize: 10, marginTop: 4 }}>
              Cancelled by: {data.cancelledBy === 'admin' ? 'Admin' : 'Customer'}
            </Text>
          )}

          <Text style={{ color: GRAY_TEXT, fontSize: 10, marginTop: 12 }}>
            Questions? Contact us at hello@northventure-demo.com
          </Text>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Arctic Trail — northventure-demo.com · Foretaksregisteret: NO 992 734 906 MVA</Text>
          <Text style={styles.footerText}>{data.vehicleName} · {data.orderId ?? `#${data.bookingId}`}{data.uploadToken ? ` · ${data.uploadToken}` : ''}</Text>
        </View>
      </Page>
    </Document>
  );
};

// ─── Driver Details Reminder Document ────────────────────────────────────────

interface DriverReminderPdfData {
  bookingId: number;
  uploadToken?: string;
  orderId?: string;
  customerName: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
}

const DriverReminderDoc = ({ data }: { data: DriverReminderPdfData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={[styles.header, { backgroundColor: '#f59e0b' }]}>
        <Text style={styles.headerTitle}>Arctic Trail</Text>
        <Text style={styles.headerSubtitle}>Action Required</Text>
      </View>

      <View style={styles.body}>
        <Text style={[styles.sectionTitle, { marginTop: 0 }]}>Driver Details Needed</Text>
        <Text style={{ color: GRAY_TEXT, fontSize: 10, marginBottom: 16, lineHeight: 1.5 }}>
          Hi {data.customerName}, please submit your driver details to finalise your booking.
        </Text>

        <View style={styles.card}>
          <Text style={[styles.sectionTitle, { marginTop: 0, fontSize: 11 }]}>Your Booking</Text>
          {data.orderId && <TableRow label="Order ID:" value={data.orderId} />}
          {data.uploadToken && <TableRow label="Booking ID:" value={data.uploadToken} />}
          <TableRow label="Vehicle:" value={data.vehicleName} />
          <TableRow label="Check-in:" value={data.startDate} />
          <TableRow label="Check-out:" value={data.endDate} last />
        </View>

        <View style={[styles.infoBox, { borderLeftColor: '#f59e0b', backgroundColor: '#fef3c7' }]}>
          <Text style={[styles.infoBoxText, { color: '#92400e' }]}>
            We need your driver details to prepare the vehicle and ensure a smooth pickup. Visit northventure-demo.com/booking-details to complete your registration.
          </Text>
        </View>

        <Text style={{ color: GRAY_TEXT, fontSize: 10, marginTop: 8 }}>
          Questions? Contact us at hello@northventure-demo.com
        </Text>
      </View>

      <View style={styles.footer} fixed>
        <Text style={styles.footerText}>Arctic Trail — northventure-demo.com · Foretaksregisteret: NO 992 734 906 MVA</Text>
        <Text style={styles.footerText}>{data.vehicleName} · {data.startDate} – {data.endDate}</Text>
      </View>
    </Page>
  </Document>
);

// ─── Admin Modification Document ──────────────────────────────────────────────

interface AdminModificationPdfData {
  bookingId: number;
  uploadToken?: string;
  orderId?: string;
  customerName: string;
  vehicleName: string;
  oldStartDate: string;
  oldEndDate: string;
  newStartDate: string;
  newEndDate: string;
  oldTotalPrice: number;
  newTotalPrice: number;
  priceDiff: number;
  refundAmount?: number;
  refundPercentage?: number;
  oldInsuranceType?: string;
  newInsuranceType?: string;
  oldSelectedExtras?: Record<string, number>;
  newSelectedExtras?: Record<string, number>;
}

const AdminModificationDoc = ({ data }: { data: AdminModificationPdfData }) => {
  const isExtrasChange = data.newInsuranceType !== undefined || data.newSelectedExtras !== undefined;
  const hasRefund = (data.refundAmount ?? 0) > 0;
  const hasSurcharge = data.priceDiff > 0;
  const oldInsuranceLabel = data.oldInsuranceType ? formatInsuranceLabel(data.oldInsuranceType) : null;
  const newInsuranceLabel = data.newInsuranceType ? formatInsuranceLabel(data.newInsuranceType) : null;
  const insuranceChanged = oldInsuranceLabel && newInsuranceLabel && oldInsuranceLabel !== newInsuranceLabel;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.header, { backgroundColor: TEAL }]}>
          <Text style={styles.headerTitle}>Arctic Trail</Text>
          <Text style={styles.headerSubtitle}>Booking Modified</Text>
        </View>

        <View style={styles.body}>
          <Text style={[styles.sectionTitle, { marginTop: 0 }]}>Modification Details</Text>

          <View style={[styles.card, { backgroundColor: '#f0fdf4' }]}>
            {data.orderId && <TableRow label="Order ID:" value={data.orderId} />}
            {data.uploadToken && <TableRow label="Booking ID:" value={data.uploadToken} />}
            <TableRow label="Vehicle:" value={data.vehicleName} />
            <TableRow label="Previous dates:" value={`${data.oldStartDate} – ${data.oldEndDate}`} />
            <TableRow label="New check-in:" value={data.newStartDate} />
            <TableRow label="New check-out:" value={data.newEndDate} />
            <TableRow label="Old total:" value={formatPrice(data.oldTotalPrice)} last />
            <TotalRow label="New Total:" value={formatPrice(data.newTotalPrice)} color={TEAL} />
          </View>

          {isExtrasChange && (insuranceChanged || data.oldSelectedExtras || data.newSelectedExtras) && (
            <>
              <Text style={styles.sectionTitle}>What Changed</Text>
              <View style={styles.card}>
                {insuranceChanged && (
                  <TableRow label="Insurance:" value={`${oldInsuranceLabel} → ${newInsuranceLabel}`} />
                )}
                {data.oldSelectedExtras && (
                  <TableRow label="Extras before:" value={formatExtras(data.oldSelectedExtras)} />
                )}
                {data.newSelectedExtras && (
                  <TableRow label="Extras after:" value={formatExtras(data.newSelectedExtras)} last />
                )}
              </View>
            </>
          )}

          {hasRefund && (
            <View style={styles.greenBox}>
              <Text style={styles.greenBoxText}>
                Refund of {formatPrice(data.refundAmount!)} ({data.refundPercentage}%) processed to original payment method within 3–5 business days.
              </Text>
            </View>
          )}

          {hasSurcharge && !hasRefund && (
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxText}>
                Additional charge of {formatPrice(data.priceDiff)} applied.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Arctic Trail — northventure-demo.com · Foretaksregisteret: NO 992 734 906 MVA</Text>
          <Text style={styles.footerText}>{data.vehicleName} · {data.newStartDate} – {data.newEndDate}</Text>
        </View>
      </Page>
    </Document>
  );
};

// ─── Export functions ──────────────────────────────────────────────────────────

export const generateBookingConfirmationPdf = async (data: ConfirmationData): Promise<Buffer> => {
  return renderToBuffer(<BookingConfirmationDoc data={data} />);
};

export const generateBookingUpdatedPdf = async (data: UpdateData): Promise<Buffer> => {
  return renderToBuffer(<BookingUpdatedDoc data={data} />);
};

export const generateAdminNewBookingPdf = async (data: AdminNewBookingData): Promise<Buffer> => {
  return renderToBuffer(<AdminNewBookingDoc data={data} />);
};

export const generateCancellationPdf = async (data: CancellationPdfData): Promise<Buffer> => {
  return renderToBuffer(<CancellationDoc data={data} />);
};

export const generateDriverReminderPdf = async (data: DriverReminderPdfData): Promise<Buffer> => {
  return renderToBuffer(<DriverReminderDoc data={data} />);
};

export const generateAdminModificationPdf = async (data: AdminModificationPdfData): Promise<Buffer> => {
  return renderToBuffer(<AdminModificationDoc data={data} />);
};

// ─── Contract Document ────────────────────────────────────────────────────────

const ContractRow = ({ label, value, last = false }: { label: string; value: string; last?: boolean }) => (
  <View style={last ? styles.rowLast : styles.row}>
    <Text style={[styles.label, { width: 130 }]}>{label}</Text>
    <Text style={[styles.value, { textAlign: 'left', fontFamily: 'Helvetica-Bold' }]}>{value}</Text>
  </View>
);

const ContractSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: PRIMARY, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
      {title}
    </Text>
    <View style={[styles.card, { padding: '10 14', marginBottom: 0 }]}>
      {children}
    </View>
  </View>
);

const SigBox = ({ label }: { label: string }) => (
  <View style={{ flex: 1 }}>
    <Text style={{ fontSize: 9, color: GRAY_TEXT, marginBottom: 4 }}>{label}</Text>
    <View style={{ height: 36, borderBottomWidth: 1, borderBottomColor: DARK_TEXT }} />
  </View>
);

const ContractDoc = ({ booking, drivers }: { booking: ContractBooking; drivers: ContractDriver[] }) => {
  const primaryDriver = drivers.find((d) => d.is_primary);
  const additionalDrivers = drivers.filter((d) => !d.is_primary);
  const extras = (booking.selected_extras || {}) as Record<string, number>;
  const extraEntries = Object.entries(extras).filter(([, qty]) => Number(qty) > 0);
  const totalPrice = typeof booking.total_price === 'string' ? parseFloat(booking.total_price) : booking.total_price;
  const insuranceKey = ((booking.insurance_type ?? 'basic').toUpperCase().replace('-', '_')) as keyof typeof PRICING.INSURANCE;
  const deposit = PRICING.INSURANCE[insuranceKey]?.deposit ?? PRICING.INSURANCE.BASIC.deposit;
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const contractRef = booking.order_id ?? `AT-${booking.id}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.header, { textAlign: 'center' }]}>
          <Text style={styles.headerTitle}>NorthVenture</Text>
          <Text style={[styles.headerSubtitle, { fontSize: 13, marginTop: 4 }]}>VEHICLE RENTAL AGREEMENT</Text>
          <Text style={[styles.headerSubtitle, { fontSize: 9, marginTop: 6 }]}>
            {contractRef}{booking.upload_token ? `  |  Booking ID: ${booking.upload_token}` : ''}  |  Created: {new Date().toLocaleDateString('en-GB')}
          </Text>
        </View>

        <View style={styles.body}>
          <Text style={{ color: GRAY_TEXT, fontSize: 9, fontStyle: 'italic', marginBottom: 16 }}>
            This agreement is entered into between NorthVenture (Lessor) and the Renter identified below.
          </Text>

          <ContractSection title="1. Rental Vehicle">
            <ContractRow label="Make / Model:" value={booking.vehicle_name ?? '—'} />
            <ContractRow label="Registration:" value={booking.vehicle_license_plate ?? '—'} />
            <ContractRow label="Odometer at pickup:" value="_______________" last />
          </ContractSection>

          <ContractSection title="2. Rental Period">
            <ContractRow label="From:" value={formatDate(booking.start_date)} />
            <ContractRow label="To:" value={formatDate(booking.end_date)} last />
          </ContractSection>

          <ContractSection title="3. Price & Payment">
            <ContractRow label="Rental Price:" value={`${totalPrice.toLocaleString('nb-NO', { minimumFractionDigits: 2 })} NOK`} />
            <ContractRow label="Security Deposit:" value={`${deposit.toLocaleString('nb-NO')} NOK`} />
            <ContractRow label="Insurance:" value={(booking.insurance_type ?? 'basic').replace('_', ' ').toUpperCase()} last />
          </ContractSection>

          {extraEntries.length > 0 && (
            <ContractSection title="Extras">
              {extraEntries.map(([id, qty], i) => {
                const extra = ALL_EXTRAS.find(e => e.id === id);
                return (
                  <ContractRow
                    key={id}
                    label={extra?.name ?? id}
                    value={`x${qty}`}
                    last={i === extraEntries.length - 1}
                  />
                );
              })}
            </ContractSection>
          )}

          <ContractSection title="4. Terms Summary">
            <Text style={{ fontSize: 9, color: DARK_TEXT, lineHeight: 1.5 }}>
              {'The Renter is responsible for the vehicle throughout the rental period, including damages, fines, tolls, and the insurance deductible in case of damage. The vehicle shall not be used for illegal purposes or by unlicensed drivers. It must be returned in the same condition as at pickup (normal wear and tear excepted). This agreement is governed by Norwegian law. Full terms: northventure-demo.com/toc'}
            </Text>
          </ContractSection>

          {primaryDriver && (
            <ContractSection title="Driver Information">
              <View style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: PRIMARY, marginBottom: 6 }}>PRIMARY DRIVER</Text>
                <ContractRow label="Full Name:" value={primaryDriver.full_name} />
                <ContractRow label="Date of Birth:" value={new Date(primaryDriver.date_of_birth).toLocaleDateString('en-GB')} />
                <ContractRow label="License Number:" value={primaryDriver.license_number} />
                <ContractRow label="License Expiry:" value={new Date(primaryDriver.license_expiry).toLocaleDateString('en-GB')} />
                <ContractRow label="License Country:" value={primaryDriver.license_country} />
                <ContractRow label="Address:" value={primaryDriver.address_line1} />
                {primaryDriver.address_line2 ? <ContractRow label="Address Line 2:" value={primaryDriver.address_line2} /> : null}
                <ContractRow label="Postal Code:" value={primaryDriver.postal_code} />
                <ContractRow label="City:" value={primaryDriver.city} />
                <ContractRow label="Country:" value={primaryDriver.country} last />
              </View>
              {additionalDrivers.map((d, i) => (
                <View key={d.id ?? i} style={{ marginTop: 10 }}>
                  <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: TEAL, marginBottom: 6 }}>ADDITIONAL DRIVER {i + 1}</Text>
                  <ContractRow label="Full Name:" value={d.full_name} />
                  <ContractRow label="Date of Birth:" value={new Date(d.date_of_birth).toLocaleDateString('en-GB')} />
                  <ContractRow label="License Number:" value={d.license_number} />
                  <ContractRow label="License Expiry:" value={new Date(d.license_expiry).toLocaleDateString('en-GB')} />
                  <ContractRow label="License Country:" value={d.license_country} last />
                </View>
              ))}
            </ContractSection>
          )}

          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: PRIMARY, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Signatures
            </Text>
            <Text style={{ fontSize: 9, color: GRAY_TEXT, marginBottom: 14 }}>
              By signing below, the Renter confirms the terms and conditions have been read and accepted.
            </Text>
            <View style={{ marginBottom: 10 }}>
              <ContractRow label="Place / Date:" value="_______________" last />
            </View>
            <View style={{ flexDirection: 'row', gap: 30, marginTop: 10 }}>
              <SigBox label="Lessor (NorthVenture)" />
              <SigBox label="Renter" />
            </View>
            {additionalDrivers.map((d, i) => (
              <View key={d.id ?? i} style={{ flexDirection: 'row', gap: 30, marginTop: 20 }}>
                <SigBox label={`Additional Driver: ${d.full_name}`} />
                <View style={{ flex: 1 }} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>NorthVenture — northventure-demo.com · hello@northventure-demo.com · +47 555 12 345</Text>
          <Text style={styles.footerText}>{contractRef}</Text>
        </View>
      </Page>
    </Document>
  );
};

export const generateContractPdf = async (booking: ContractBooking, drivers: ContractDriver[]): Promise<Buffer> => {
  return renderToBuffer(<ContractDoc booking={booking} drivers={drivers} />);
};
