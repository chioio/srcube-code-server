import { compare, hash } from 'bcryptjs';

export class EncryptedHelper {
  static validate(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  static encrypt(password: string): Promise<string> {
    return hash(password, 10);
  }
}
