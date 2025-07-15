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
  token: { token: string };
  id: number;
  fullName: string;
  email: string;
}
