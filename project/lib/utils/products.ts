export type ExpiryStatus = 'expired' | 'expiring-today' | 'expiring-soon' | 'normal';

export function getExpiryStatus(expiryDate: string): ExpiryStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'expired';
  if (diffDays === 0) return 'expiring-today';
  if (diffDays <= 30) return 'expiring-soon';
  return 'normal';
}

export function getExpiryStatusColor(status: ExpiryStatus): string {
  switch (status) {
    case 'expired':
      return 'bg-red-50 border-red-200';
    case 'expiring-today':
      return 'bg-orange-50 border-orange-200';
    case 'expiring-soon':
      return 'bg-yellow-50 border-yellow-200';
    case 'normal':
      return 'bg-green-50 border-green-200';
  }
}

export function getExpiryStatusBadge(status: ExpiryStatus): string {
  switch (status) {
    case 'expired':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'expiring-today':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'expiring-soon':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'normal':
      return 'bg-green-100 text-green-800 border-green-200';
  }
}

export function getExpiryStatusLabel(status: ExpiryStatus): string {
  switch (status) {
    case 'expired':
      return 'Vencido';
    case 'expiring-today':
      return 'Vence hoje';
    case 'expiring-soon':
      return 'Vence em breve';
    case 'normal':
      return 'Normal';
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}
