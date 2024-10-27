import { compare, hash } from 'bcryptjs';

import { IHashComparer } from '@domain/pet-guardian/application/cryptography/hash-comparer';
import { IHashGenerator } from '@domain/pet-guardian/application/cryptography/hash-generator';

export class BcrypterHasher implements IHashGenerator, IHashComparer {
  private HASH_SALT_LENGTH = 8;

  async compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }

  async hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH);
  }
}
