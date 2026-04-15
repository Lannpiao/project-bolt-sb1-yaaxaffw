'use client';

import { Product, Profile } from '@/lib/supabase/types';
import ProductCard from '@/components/ProductCard';
import { Package } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  profile: Profile | null;
  onDelete: (id: string) => Promise<void>;
  onUpdateQuantity: (id: string, quantidade: number) => Promise<void>;
  onTogglePromocao: (id: string, emPromocao: boolean) => Promise<void>;
}

export default function ProductList({
  products,
  loading,
  profile,
  onDelete,
  onUpdateQuantity,
  onTogglePromocao,
}: ProductListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <Package className="mx-auto mb-4 h-16 w-16 text-slate-300" />
        <h3 className="mb-2 text-lg font-semibold text-slate-900">
          Nenhum produto encontrado
        </h3>
        <p className="text-slate-600">
          Cadastre produtos para começar o controle de validade
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          Produtos ({products.length})
        </h3>
        <p className="text-sm text-slate-600">
          Ordenados por data de vencimento
        </p>
      </div>

      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isGerente={profile?.role === 'GERENTE'}
          onDelete={onDelete}
          onUpdateQuantity={onUpdateQuantity}
          onTogglePromocao={onTogglePromocao}
        />
      ))}
    </div>
  );
}