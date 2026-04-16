'use client';
import { Product } from '@/lib/supabase/types';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import ProductStats from '@/components/ProductStats';
import ProductList from '@/components/ProductList';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CATEGORIES = [
  'Todos',
  'Bebidas',
  'Limpeza',
  'Matinais',
  'Laticínios',
  'Carnes',
  'Frios',
  'Padaria',
  'Hortifruti',
  'Congelados',
  'Mercearia',
  'Alimentos',
];

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchBarcode, setSearchBarcode] = useState('');
  const { user, profile } = useAuth();

  const fetchProducts = async () => {
    setLoading(true);

    try {
      let query = supabase
        .from('produtos')
        .select('*')
        .order('validade', { ascending: true });

      if (selectedCategory !== 'Todos') {
        query = query.eq('categoria', selectedCategory);
      }

      if (searchBarcode) {
        query = query.ilike('codigo_barras', `%${searchBarcode}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Deseja realmente excluir este produto?');
    if (!confirmed) return;

    try {
      const { error } = await supabase.from('produtos').delete().eq('id', id);

      if (error) throw error;

      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Produto excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast.error('Erro ao excluir produto');
    }
  };

  const handleUpdateQuantity = async (id: string, quantidade: number) => {
    if (quantidade < 1) {
      toast.error('A quantidade deve ser maior que zero');
      return;
    }

    try {
      const { error } = await (supabase as any)
        .from('produtos')
        .update({ quantidade })
        .eq('id', id);

      if (error) throw error;

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, quantidade } : p))
      );

      toast.success('Quantidade atualizada com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      toast.error('Erro ao atualizar quantidade');
    }
  };

  const handleTogglePromocao = async (id: string, emPromocao: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from('produtos')
        .update({ em_promocao: emPromocao })
        .eq('id', id);

      if (error) throw error;

      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, em_promocao: emPromocao } : p
        )
      );

      toast.success('Status de promoção atualizado');
    } catch (error) {
      console.error('Erro ao atualizar promoção:', error);
      toast.error('Erro ao atualizar promoção');
    }
  };

  const handleToggleTroca = async (id: string, temTroca: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from('produtos')
        .update({ tem_troca: temTroca })
        .eq('id', id);

      if (error) throw error;

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, tem_troca: temTroca } : p))
      );

      toast.success('Status de troca atualizado');
    } catch (error) {
      console.error('Erro ao atualizar troca:', error);
      toast.error('Erro ao atualizar troca');
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchProducts();
  }, [user, selectedCategory, searchBarcode]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-slate-600">
            Gerencie os produtos e suas validades
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Perfil: {profile?.role ?? 'Sem perfil'}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchProducts}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      <ProductStats products={products} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="barcode">Buscar por Código</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                id="barcode"
                placeholder="Digite o código..."
                value={searchBarcode}
                onChange={(e) => setSearchBarcode(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <ProductList
          products={products}
          loading={loading}
          profile={profile}
          onDelete={handleDelete}
          onUpdateQuantity={handleUpdateQuantity}
          onTogglePromocao={handleTogglePromocao}
          onToggleTroca={handleToggleTroca}
        />
      </div>
    </div>
  );
}