'use client';

import { Product } from '@/lib/supabase/types';
import { AlertTriangle, Clock3, Calendar, CheckCircle2 } from 'lucide-react';

interface ProductStatsProps {
  products: Product[];
}

export default function ProductStats({ products }: ProductStatsProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stats = products.reduce(
    (acc, product) => {
      const expiryDate = new Date(product.validade);
      expiryDate.setHours(0, 0, 0, 0);

      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        acc.expired += 1;
      } else if (diffDays === 0) {
        acc.today += 1;
      } else if (diffDays <= 30) {
        acc.soon += 1;
      } else {
        acc.normal += 1;
      }

      return acc;
    },
    {
      expired: 0,
      today: 0,
      soon: 0,
      normal: 0,
    }
  );

  const cards = [
    {
      title: 'Vencidos',
      value: stats.expired,
      icon: AlertTriangle,
      className: 'border-red-200 bg-red-50 text-red-600',
    },
    {
      title: 'Vencem Hoje',
      value: stats.today,
      icon: Clock3,
      className: 'border-orange-200 bg-orange-50 text-orange-600',
    },
    {
      title: 'Vencem em Breve',
      value: stats.soon,
      icon: Calendar,
      className: 'border-yellow-200 bg-yellow-50 text-yellow-700',
    },
    {
      title: 'Normais',
      value: stats.normal,
      icon: CheckCircle2,
      className: 'border-green-200 bg-green-50 text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`rounded-2xl border p-6 ${card.className}`}
          >
            <div className="mb-4 flex items-center justify-between">
              <Icon className="h-7 w-7" />
              <span className="text-4xl font-bold">{card.value}</span>
            </div>
            <p className="text-xl font-medium">{card.title}</p>
          </div>
        );
      })}
    </div>
  );
}