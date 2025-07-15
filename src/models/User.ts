export interface User {
  id: number;
  fullName: string | null;
  email: string;
  document: string;
  phone: string;
  groupId: number;
  role: string;
  createdAt: string; // ISO 8601
  updatedAt: string | null; // ISO 8601 ou null
}

export interface LoginResponse {
  token: {
    token: string; // string de autenticação
    name: string; // nome da token (geralmente email)
    type: string; // tipo de token (e.g. "bearer")
    expiresAt: string; // ISO 8601
  };
  id: number;
  fullName: string | null;
  email: string;
  document: string;
  phone: string;
  groupId: number;
  role: string;
  createdAt: string;
  updatedAt: string | null;
}
