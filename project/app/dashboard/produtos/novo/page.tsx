'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '@/components/ProductForm';

export default function NewProductPage() {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <h1 className="text-3xl font-bold text-slate-900">
          Cadastrar Produto
        </h1>
        <p className="text-slate-600 mt-2">
          Preencha as informações do produto com atenção
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <ProductForm />
      </div>
    </div>
  );
}
