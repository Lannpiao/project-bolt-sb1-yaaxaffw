'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Package2, LogOut, Chrome as Home, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Logout realizado com sucesso');
    router.push('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                <Package2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  Controle de Validade
                </h1>
                {profile && (
                  <p className="text-xs text-slate-500">
                    {profile.role === 'GERENTE' ? 'Gerente' : 'Funcionário'}
                  </p>
                )}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard/produtos/novo')}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Novo Produto
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {profile && (
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-slate-900">
                  {user?.email ?? 'Usuário'}
                </p>
                <p className="text-xs text-slate-500">
                  {profile.role === 'GERENTE' ? 'Gerente' : 'Funcionário'}
                </p>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}