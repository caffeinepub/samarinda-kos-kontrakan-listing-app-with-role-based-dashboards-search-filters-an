export function formatRupiah(value: bigint | number | string): string {
  const numValue = typeof value === 'bigint' ? Number(value) : typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return 'Rp 0';
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);
}

export function parseRupiah(value: string): number {
  return parseInt(value.replace(/[^0-9]/g, '')) || 0;
}

