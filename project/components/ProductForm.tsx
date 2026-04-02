'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Save, Loader2 } from 'lucide-react';

const BarcodeScanner = dynamic(() => import('@/components/BarcodeScanner'), {
  ssr: false,
});

const CATEGORIES = [
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

export default function ProductForm() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [barcode, setBarcode] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !category || !barcode || !expiryDate || !quantity) {
      toast.error('Preencha todos os campos');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(expiryDate + 'T12:00:00');

    if (selectedDate < today) {
      toast.error('A data de validade não pode ser no passado');
      return;
    }

    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    setLoading(true);

    try {
      const { error } = await (supabase as any).from('produtos').insert([
        {
          nome: name,
          categoria: category,
          codigo_barras: barcode,
          validade: expiryDate,
          quantidade: parseInt(quantity, 10),
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      toast.success('Produto cadastrado com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      toast.error('Erro ao cadastrar produto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Nome do Produto *
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Ex: Leite Integral 1L"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          className="h-12 text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="text-sm font-medium">
          Categoria (Corredor) *
        </Label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={loading}
          className="h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base"
        >
          <option value="">Selecione a categoria</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="barcode" className="text-sm font-medium">
          Código de Barras *
        </Label>

        <Input
          id="barcode"
          type="text"
          placeholder="Ex: 7891234567890"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          disabled={loading}
          className="h-12 text-base"
        />

        {isMobile && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowScanner((prev) => !prev)}
            disabled={loading}
            className="mt-3 h-12 w-full text-base"
          >
            {showScanner ? 'Fechar câmera' : 'Escanear código'}
          </Button>
        )}

        {isMobile && showScanner && (
          <div className="mt-3">
            <BarcodeScanner
              onResult={(code) => {
                setBarcode(code);
                setShowScanner(false);
                toast.success(`Código lido: ${code}`);
              }}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="expiryDate" className="text-sm font-medium">
            Data de Validade *
          </Label>
          <Input
            id="expiryDate"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            disabled={loading}
            className="h-12 text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-sm font-medium">
            Quantidade *
          </Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            placeholder="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            disabled={loading}
            className="h-12 text-base"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
          className="h-12 flex-1 text-base"
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          disabled={loading}
          className="h-12 flex-1 text-base font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              Salvar Produto
            </>
          )}
        </Button>
      </div>
    </form>
  );
}