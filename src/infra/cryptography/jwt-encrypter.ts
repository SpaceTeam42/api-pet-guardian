import { FastifyReply } from 'fastify';

import { Encrypter } from '@domain/pet-guardian/application/cryptography/encrypter';

export class JwtEncrypter implements Encrypter {
  constructor(private reply: FastifyReply) {}

  async encrypt(payload: string, expiresIn: string): Promise<string> {
    const token = await this.reply.jwtSign(
      {},
      {
        sign: {
          sub: payload,
          expiresIn,
        },
      },
    );

    return token;
  }
}
