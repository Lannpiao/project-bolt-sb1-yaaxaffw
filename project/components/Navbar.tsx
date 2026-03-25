'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Package2,
  LogOut,
  Chrome as Home,
  Plus,
  Menu,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Logout realizado com sucesso');
    router.push('/login');
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex min-h-16 items-center justify-between gap-3 py-2">
          <button
            onClick={() => handleNavigate('/dashboard')}
            className="flex min-w-0 items-center gap-3 rounded-xl text-left transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label="Ir para o dashboard"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900">
              <Package2 className="h-5 w-5 text-white" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                Controle de Validade
              </h1>
              {profile && (
                <p className="truncate text-xs text-slate-500">
                  {profile.role === 'GERENTE' ? 'Gerente' : 'Funcionário'}
                </p>
              )}
            </div>
          </button>

          <div className="hidden items-center gap-2 md:flex">
            <Button
              type="button"
              variant={isActive('/dashboard') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleNavigate('/dashboard')}
              className="gap-2"
              aria-current={isActive('/dashboard') ? 'page' : undefined}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Button>

            <Button
              type="button"
              variant={
                isActive('/dashboard/produtos/novo') ? 'default' : 'ghost'
              }
              size="sm"
              onClick={() => handleNavigate('/dashboard/produtos/novo')}
              className="gap-2"
              aria-current={
                isActive('/dashboard/produtos/novo') ? 'page' : undefined
              }
            >
              <Plus className="h-4 w-4" />
              Novo Produto
            </Button>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {profile && (
              <div className="max-w-[220px] text-right">
                <p className="truncate text-sm font-medium text-slate-900">
                  {user?.email ?? 'Usuário'}
                </p>
                <p className="text-xs text-slate-500">
                  {profile.role === 'GERENTE' ? 'Gerente' : 'Funcionário'}
                </p>
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="border-t border-slate-200 py-3 md:hidden"
          >
            <div className="mb-3 rounded-xl bg-slate-50 p-3">
              <p className="truncate text-sm font-medium text-slate-900">
                {user?.email ?? 'Usuário'}
              </p>
              {profile && (
                <p className="mt-1 text-xs text-slate-500">
                  {profile.role === 'GERENTE' ? 'Gerente' : 'Funcionário'}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant={isActive('/dashboard') ? 'default' : 'ghost'}
                onClick={() => handleNavigate('/dashboard')}
                className="justify-start gap-2"
                aria-current={isActive('/dashboard') ? 'page' : undefined}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>

              <Button
                type="button"
                variant={
                  isActive('/dashboard/produtos/novo') ? 'default' : 'ghost'
                }
                onClick={() => handleNavigate('/dashboard/produtos/novo')}
                className="justify-start gap-2"
                aria-current={
                  isActive('/dashboard/produtos/novo') ? 'page' : undefined
                }
              >
                <Plus className="h-4 w-4" />
                Novo Produto
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleSignOut}
                className="justify-start gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}