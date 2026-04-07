import { createHash, randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

export async function hashPassword(value: string): Promise<string> {
  return bcrypt.hash(value, 12);
}

export async function comparePassword(
  rawValue: string,
  hashedValue: string,
): Promise<boolean> {
  return bcrypt.compare(rawValue, hashedValue);
}

export function generateOpaqueToken(size = 32): string {
  return randomBytes(size).toString('hex');
}

export function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}
