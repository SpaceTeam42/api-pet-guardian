import path from 'node:path';
import fs from 'node:fs';

import uploadConfig from '@config/upload';

import { IStorage } from '@domain/pet-guardian/application/storage/storage';

export class DiskStorage implements IStorage {
  async save(file: string, folder?: string): Promise<string> {
    let folderPath = uploadConfig.tmpFolder;

    if (folder) {
      folderPath = `${uploadConfig.tmpFolder}/${folder}`;
    }

    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(folderPath, file),
    );

    return file;
  }

  async delete(file: string, folder?: string): Promise<void> {
    let folderPath = uploadConfig.tmpFolder;

    if (folder) {
      folderPath = `${uploadConfig.tmpFolder}/${folder}`;
    }

    const filePath = path.resolve(folderPath, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}
