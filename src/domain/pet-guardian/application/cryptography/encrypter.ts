export interface Encrypter {
  encrypt(payload: string, expiresIn: string): Promise<string>;
}
