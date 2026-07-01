'use client';

import { generateContractHTML, ContractBooking, ContractDriver } from '@/lib/contract';

interface ContractGeneratorProps {
  booking: ContractBooking;
  drivers: ContractDriver[];
}

export { generateContractHTML };

export function openContractWindow(booking: ContractBooking, drivers: ContractDriver[]): void {
  const contractWindow = window.open('', '_blank');
  if (!contractWindow) return;

  const html = generateContractHTML(booking, drivers);
  contractWindow.document.write(html);
  contractWindow.document.close();
  contractWindow.focus();
  setTimeout(() => contractWindow.print(), 250);
}

export function ContractGenerator({ booking, drivers }: ContractGeneratorProps) {
  return (
    <button
      onClick={() => openContractWindow(booking, drivers)}
      className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-all"
    >
      Generate Contract
    </button>
  );
}
