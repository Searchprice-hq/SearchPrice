export interface User {
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

export interface LoginResponse {
  token: {
    token: string;
    name: string;
    type: string;
    expiresAt: string;
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
