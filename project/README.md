# 🏪 Sistema de Controle de Validade - Supermercado

Sistema completo para controle de validade de produtos em supermercados, desenvolvido com Next.js, TypeScript, Tailwind CSS e Supabase.

## ✨ Funcionalidades

### 🔐 Autenticação
- Login com email e senha
- Dois tipos de usuário:
  - **FUNCIONARIO**: Pode cadastrar produtos
  - **GERENTE**: Visualiza todos os produtos com filtros avançados

### 📦 Gestão de Produtos
- Cadastro completo de produtos com:
  - Nome do produto
  - Categoria (corredor)
  - Código de barras
  - Data de validade
  - Quantidade em estoque
- Validação automática de datas
- Organização por categoria

### 📊 Dashboard Inteligente
- **Contadores em tempo real:**
  - Produtos vencidos
  - Produtos que vencem hoje
  - Produtos que vencem em breve (até 3 dias)
  - Produtos normais

- **Filtros:**
  - Por categoria (corredor)
  - Busca por código de barras

- **Destaques visuais:**
  - 🔴 Vermelho: Produtos vencidos
  - 🟠 Laranja: Produtos que vencem hoje
  - 🟡 Amarelo: Produtos que vencem em até 3 dias
  - 🟢 Verde: Produtos normais

### 🔍 Busca Inteligente
- Busca instantânea por código de barras
- Filtro em tempo real

## 🚀 Tecnologias

- **Next.js 13** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Database + Auth)
- **shadcn/ui** (Componentes)
- **Lucide React** (Ícones)

## 📁 Estrutura do Projeto

```
├── app/
│   ├── dashboard/              # Dashboard principal
│   │   └── produtos/novo/      # Cadastro de produtos
│   ├── login/                  # Página de login
│   ├── layout.tsx              # Layout raiz
│   └── page.tsx                # Página inicial (redirect)
├── components/
│   ├── ui/                     # Componentes shadcn/ui
│   ├── LoginForm.tsx           # Formulário de login
│   ├── Navbar.tsx              # Barra de navegação
│   ├── ProductCard.tsx         # Card de produto
│   ├── ProductForm.tsx         # Formulário de produto
│   ├── ProductList.tsx         # Lista de produtos
│   └── ProductStats.tsx        # Estatísticas
├── lib/
│   ├── context/
│   │   └── AuthContext.tsx     # Contexto de autenticação
│   ├── hooks/
│   │   └── useAuth.ts          # Hook de autenticação
│   ├── supabase/
│   │   ├── client.ts           # Cliente Supabase
│   │   └── types.ts            # Tipos TypeScript
│   └── utils/
│       └── products.ts         # Utilitários de produtos
└── SETUP.md                    # Instruções de setup
```

## 🗄️ Schema do Banco de Dados

### Companies (Empresas)
- `id`: UUID
- `name`: Nome da empresa
- `created_at`: Data de criação

### Profiles (Perfis de Usuário)
- `id`: UUID (referência para auth.users)
- `name`: Nome do usuário
- `email`: Email
- `role`: FUNCIONARIO | GERENTE
- `company_id`: Referência para companies
- `created_at`: Data de criação

### Products (Produtos)
- `id`: UUID
- `name`: Nome do produto
- `category`: Categoria/corredor
- `barcode`: Código de barras
- `expiry_date`: Data de validade
- `quantity`: Quantidade em estoque
- `company_id`: Referência para companies
- `created_by`: Referência para auth.users
- `created_at`: Data de criação

## 🔒 Segurança

- **Row Level Security (RLS)** habilitado em todas as tabelas
- Usuários só podem acessar dados da própria empresa
- Autenticação via Supabase Auth
- Políticas de segurança granulares

## 🎨 Design

- Interface moderna e limpa
- Design responsivo (mobile-first)
- Botões grandes para facilitar uso em dispositivos móveis
- Feedback visual em todas as ações
- Cores intuitivas para status de validade

## 📝 Categorias Disponíveis

- Bebidas
- Limpeza
- Matinais
- Laticínios
- Carnes
- Frios
- Padaria
- Hortifruti
- Congelados
- Mercearia

## 🔧 Setup e Configuração

Consulte o arquivo [SETUP.md](./SETUP.md) para instruções detalhadas sobre:
- Como criar usuários de teste
- Como inserir produtos de exemplo
- Configuração do banco de dados

## 🚀 Como Usar

1. **Login**: Acesse com suas credenciais de funcionário ou gerente

2. **Cadastrar Produto** (FUNCIONARIO):
   - Clique em "Novo Produto"
   - Preencha todos os campos obrigatórios
   - A data de validade não pode ser no passado
   - Clique em "Salvar Produto"

3. **Visualizar Dashboard** (GERENTE):
   - Veja os contadores de produtos
   - Filtre por categoria
   - Busque por código de barras
   - Produtos ordenados por data de validade

4. **Identificar Produtos Críticos**:
   - Fundo vermelho: Produto vencido - REMOVER
   - Fundo laranja: Vence hoje - AÇÃO URGENTE
   - Fundo amarelo: Vence em breve - MONITORAR
   - Fundo verde: Produto normal

## 🎯 Diferenciais

- ✅ MVP funcional e pronto para uso
- ✅ Código limpo e organizado
- ✅ Separação de lógica de negócio
- ✅ Componentes reutilizáveis
- ✅ Validações robustas
- ✅ Preparado para evolução SaaS
- ✅ Multi-empresa (arquitetura pronta)
- ✅ Escalável e performático

## 🔮 Próximos Passos (Futuro)

- Notificações push para produtos vencendo
- Relatórios e exportação de dados
- Gestão de múltiplas unidades
- Sistema de alertas automáticos
- Dashboard de perdas e estatísticas
- Integração com leitores de código de barras
- App mobile nativo
- Sistema de permissões avançado

## 📄 Licença

MIT

---

Desenvolvido com ❤️ para otimizar a gestão de validade em supermercados
