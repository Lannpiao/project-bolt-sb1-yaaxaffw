export type UserRole = 'FUNCIONARIO' | 'GERENTE';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id: string;
          role: UserRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          created_at?: string;
        };
      };
      produtos: {
        Row: {
          id: string;
          nome: string;
          categoria: string;
          codigo_barras: string | null;
          validade: string;
          quantidade: number;
          em_promocao: boolean;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          categoria: string;
          codigo_barras?: string | null;
          validade: string;
          quantidade: number;
          em_promocao?: boolean;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          categoria?: string;
          codigo_barras?: string | null;
          validade?: string;
          quantidade?: number;
          em_promocao?: boolean;
          user_id?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Product = Database['public']['Tables']['produtos']['Row'];