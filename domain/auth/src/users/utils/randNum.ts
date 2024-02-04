import * as crypto from "crypto"

export default function generateRandNum(): number {
    const buffer = crypto.randomBytes(4);
    const uniqueRandom = buffer.readUInt32LE(0);
    return uniqueRandom;
}