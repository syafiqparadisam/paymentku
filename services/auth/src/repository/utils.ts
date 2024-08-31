import * as crypto from 'crypto';

export class Utils {
  static generateRandNum(): number {
    const buffer = crypto.randomBytes(4);
    const uniqueRandom = buffer.readUInt32LE(0);
    return uniqueRandom;
  }

  static parseDateToTimestamptz(): string {
    const date = new Date().toISOString();
    return date;
  }
}
