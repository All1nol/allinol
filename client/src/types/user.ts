export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  profilePicture?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
} 