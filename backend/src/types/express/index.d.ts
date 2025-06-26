import type { User } from '../../database/userRepository';

declare global {
  namespace Express {
    interface User extends Omit<User, 'created_at' | 'updated_at'> {}
    interface Request {
      user?: User;
    }
  }
}

export {}; 