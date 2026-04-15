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
  onTogglePromocao: (id: string, emPromocao: boolean) => Promise<void>;
}

export default function ProductCard({
  product,
  isGerente,
  onDelete,
  onUpdateQuantity,
  onTogglePromocao,
}: ProductCardProps) {
  const status = getExpiryStatus(product.validade);
  const statusColor = getExpiryStatusColor(status);
  const badgeColor = getExpiryStatusBadge(status);
  const statusLabel = getExpiryStatusLabel(status);

  const [editingQuantity, setEditingQuantity] = useState(false);
  const [newQuantity, setNewQuantity] = useState(product.quantidade);
  const [savingQuantity, setSavingQuantity] = useState(false);
  const [savingPromotion, setSavingPromotion] = useState(false);

  const handleStartEdit = () => {
    setNewQuantity(product.quantidade);
    setEditingQuantity(true);
  };

  const handleCancelEdit = () => {
    setNewQuantity(product.quantidade);
    setEditingQuantity(false);
  };

  const handleSaveQuantity = async () => {
    if (!Number.isFinite(newQuantity) || newQuantity < 1) return;

    try {
      setSavingQuantity(true);
      await onUpdateQuantity(product.id, newQuantity);
      setEditingQuantity(false);
    } finally {
      setSavingQuantity(false);
    }
  };

  const handleTogglePromocao = async (checked: boolean) => {
    try {
      setSavingPromotion(true);
      await onTogglePromocao(product.id, checked);
    } finally {
      setSavingPromotion(false);
    }
  };

  return (
    <div className={`${statusColor} rounded-xl border p-4 sm:p-5 transition-all hover:shadow-md`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
            <Package className="h-5 w-5 text-slate-600" />
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-base font-semibold leading-tight text-slate-900 sm:text-lg break-words">
              {product.nome}
            </h4>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge className={`${badgeColor} border`} variant="outline">
                {statusLabel}
              </Badge>

              {product.em_promocao && (
                <Badge variant="outline" className="border-blue-300 text-blue-700">
                  Em promoção
                </Badge>
              )}
            </div>

            {/* CHECKBOX */}
            <div className="mt-3 flex items-center gap-2">
              <input
                type="checkbox"
                checked={product.em_promocao || false}
                onChange={(e) => handleTogglePromocao(e.target.checked)}
                disabled={savingPromotion}
                className="h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm font-medium text-slate-700">
                Em promoção
              </span>
            </div>
          </div>
        </div>

        {isGerente && (
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {!editingQuantity && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleStartEdit}
                className="w-full justify-center gap-2 sm:w-auto"
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
              className="w-full justify-center gap-2 sm:w-auto"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-2 text-slate-700">
            <Tag className="h-4 w-4 shrink-0 text-slate-500" />
            <span className="font-medium break-words">{product.categoria}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Hash className="h-4 w-4 shrink-0 text-slate-500" />
            <span className="font-mono break-all">
              {product.codigo_barras || '-'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Calendar className="h-4 w-4 shrink-0 text-slate-500" />
            <span>{formatDate(product.validade)}</span>
          </div>

          <div className="flex items-start gap-2 text-slate-700">
            <Package className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

            {editingQuantity ? (
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                <input
                  type="number"
                  min="1"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(Number(e.target.value))}
                  className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-sm sm:w-24"
                  disabled={savingQuantity}
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveQuantity}
                    disabled={savingQuantity}
                    className="rounded p-1 text-green-600 hover:bg-green-50"
                  >
                    <Check className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={savingQuantity}
                    className="rounded p-1 text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <span>{product.quantidade} unidades</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}