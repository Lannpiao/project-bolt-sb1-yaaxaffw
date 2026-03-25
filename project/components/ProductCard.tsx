'use client';

import { useState } from 'react';
import { Product } from '@/lib/supabase/types';
import {
  getExpiryStatus,
  getExpiryStatusColor,
  getExpiryStatusBadge,
  getExpiryStatusLabel,
  formatDate,
} from '@/lib/utils/products';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  Calendar,
  Hash,
  Tag,
  Trash2,
  Pencil,
  Check,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  isGerente: boolean;
  onDelete: (id: string) => Promise<void>;
  onUpdateQuantity: (id: string, quantidade: number) => Promise<void>;
}

export default function ProductCard({
  product,
  isGerente,
  onDelete,
  onUpdateQuantity,
}: ProductCardProps) {
  const status = getExpiryStatus(product.validade);
  const statusColor = getExpiryStatusColor(status);
  const badgeColor = getExpiryStatusBadge(status);
  const statusLabel = getExpiryStatusLabel(status);

  const [editingQuantity, setEditingQuantity] = useState(false);
  const [newQuantity, setNewQuantity] = useState(product.quantidade);
  const [savingQuantity, setSavingQuantity] = useState(false);

  const handleStartEdit = () => {
    setNewQuantity(product.quantidade);
    setEditingQuantity(true);
  };

  const handleCancelEdit = () => {
    setNewQuantity(product.quantidade);
    setEditingQuantity(false);
  };

  const handleSaveQuantity = async () => {
    if (!Number.isFinite(newQuantity) || newQuantity < 1) {
      return;
    }

    try {
      setSavingQuantity(true);
      await onUpdateQuantity(product.id, newQuantity);
      setEditingQuantity(false);
    } finally {
      setSavingQuantity(false);
    }
  };

  return (
    <div
      className={`${statusColor} rounded-xl border p-5 transition-all hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white">
                <Package className="h-5 w-5 text-slate-600" />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="mb-1 truncate text-lg font-semibold text-slate-900">
                  {product.nome}
                </h4>

                <Badge className={`${badgeColor} border`} variant="outline">
                  {statusLabel}
                </Badge>
              </div>
            </div>

            {isGerente && (
              <div className="flex gap-2">
                {!editingQuantity && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleStartEdit}
                    className="gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar qtd
                  </Button>
                )}

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(product.id)}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
            <div className="flex items-center gap-2 text-slate-700">
              <Tag className="h-4 w-4 text-slate-500" />
              <span className="font-medium">{product.categoria}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <Hash className="h-4 w-4 text-slate-500" />
              <span className="font-mono">{product.codigo_barras || '-'}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span>{formatDate(product.validade)}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <Package className="h-4 w-4 text-slate-500" />

              {editingQuantity ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                    className="w-20 rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
                    disabled={savingQuantity}
                  />

                  <button
                    type="button"
                    onClick={handleSaveQuantity}
                    disabled={savingQuantity}
                    className="text-green-600 hover:text-green-700 disabled:opacity-50"
                    title="Salvar"
                  >
                    <Check className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={savingQuantity}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50"
                    title="Cancelar"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <span>{product.quantidade} unidades</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}