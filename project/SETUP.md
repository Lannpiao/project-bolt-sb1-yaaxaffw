# Setup - Sistema de Controle de Validade

## Como criar usuários de teste

Para testar o sistema, você precisa criar usuários através do Supabase Auth. Siga os passos:

### Opção 1: Via SQL (Recomendado)

Execute este comando SQL no Supabase para criar usuários de teste:

```sql
-- Criar empresa de teste (se ainda não existe)
INSERT INTO companies (id, name)
VALUES ('11111111-1111-1111-1111-111111111111', 'Supermercado Teste')
ON CONFLICT (id) DO NOTHING;

-- Criar usuário GERENTE
-- Email: gerente@teste.com
-- Senha: senha123

-- Criar usuário FUNCIONARIO
-- Email: funcionario@teste.com
-- Senha: senha123
```

**Importante:** Para criar os usuários, você precisa usar a API do Supabase Auth ou o Dashboard do Supabase em "Authentication" > "Users" > "Add User".

### Opção 2: Via Dashboard Supabase

1. Acesse o Dashboard do Supabase
2. Vá em **Authentication** > **Users**
3. Clique em **Add User**
4. Preencha os dados:
   - **Email:** gerente@teste.com
   - **Password:** senha123
   - **User Metadata:**
     ```json
     {
       "name": "João Silva",
       "role": "GERENTE",
       "company_id": "11111111-1111-1111-1111-111111111111"
     }
     ```
5. Repita para criar o funcionário:
   - **Email:** funcionario@teste.com
   - **Password:** senha123
   - **User Metadata:**
     ```json
     {
       "name": "Maria Santos",
       "role": "FUNCIONARIO",
       "company_id": "11111111-1111-1111-1111-111111111111"
     }
     ```

### Inserir Produtos de Teste

Depois de criar os usuários, execute este SQL para adicionar produtos de exemplo:

```sql
-- Produtos com diferentes status de validade
-- (substitua 'USER_ID_AQUI' pelo ID do usuário criado)

INSERT INTO products (name, category, barcode, expiry_date, quantity, company_id, created_by)
VALUES
  -- Produtos VENCIDOS
  ('Leite Integral 1L', 'Laticínios', '7891234567890', CURRENT_DATE - INTERVAL '5 days', 10, '11111111-1111-1111-1111-111111111111', NULL),
  ('Iogurte Natural', 'Laticínios', '7891234567891', CURRENT_DATE - INTERVAL '2 days', 5, '11111111-1111-1111-1111-111111111111', NULL),

  -- Produtos que VENCEM HOJE
  ('Pão Francês', 'Padaria', '7891234567892', CURRENT_DATE, 20, '11111111-1111-1111-1111-111111111111', NULL),

  -- Produtos que VENCEM EM BREVE (1-3 dias)
  ('Queijo Mussarela', 'Frios', '7891234567893', CURRENT_DATE + INTERVAL '2 days', 8, '11111111-1111-1111-1111-111111111111', NULL),
  ('Presunto Fatiado', 'Frios', '7891234567894', CURRENT_DATE + INTERVAL '3 days', 6, '11111111-1111-1111-1111-111111111111', NULL),

  -- Produtos NORMAIS
  ('Refrigerante 2L', 'Bebidas', '7891234567895', CURRENT_DATE + INTERVAL '30 days', 50, '11111111-1111-1111-1111-111111111111', NULL),
  ('Sabão em Pó 1kg', 'Limpeza', '7891234567896', CURRENT_DATE + INTERVAL '180 days', 30, '11111111-1111-1111-1111-111111111111', NULL),
  ('Café 500g', 'Matinais', '7891234567897', CURRENT_DATE + INTERVAL '90 days', 15, '11111111-1111-1111-1111-111111111111', NULL);
```

## Estrutura do Sistema

### Tipos de Usuário

- **FUNCIONARIO:** Pode cadastrar produtos
- **GERENTE:** Pode visualizar todos os produtos, filtrar por categoria, buscar por código de barras

### Status dos Produtos

Os produtos são automaticamente classificados por sua data de validade:

- 🔴 **Vencido:** Data de validade já passou
- 🟠 **Vence hoje:** Data de validade é hoje
- 🟡 **Vence em breve:** Vence em até 3 dias
- 🟢 **Normal:** Vence em mais de 3 dias

### Categorias Disponíveis

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

## Acesso ao Sistema

Após criar os usuários, acesse:

- **URL:** http://localhost:3000
- **Gerente:** gerente@teste.com / senha123
- **Funcionário:** funcionario@teste.com / senha123
