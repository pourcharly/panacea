import * as eccrypto from 'eccrypto';
import { Buffer } from 'buffer';

export async function encryptData(publicKey: Buffer, data: string) {
    return eccrypto.encrypt(publicKey, Buffer.from(data));
};

export async function decryptData(privateKey: Buffer, encryptedData: eccrypto.Ecies) {
    return eccrypto.decrypt(privateKey, encryptedData)
        .then(data => data.toString());
};

export function bufferToHexa(buffer: Buffer) {
    return Array.from(buffer)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

const encoder = new TextEncoder();
const encryptionAlgo = {
  name: "AES-GCM",
  length: 256,
};
export async function getEncryptionKey(value: string, salt: string) {
    const masterPassword = await getMasterPassword(value);
    const algorithm = {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 1000,
      hash: { name: "SHA-1" },
    };
    const keyUsages: KeyUsage[] = ["encrypt", "decrypt"];

    return await crypto.subtle.deriveKey(algorithm, masterPassword, encryptionAlgo, false, keyUsages);
}

async function getMasterPassword(value: string) {
    const format = 'raw';
    const encodedValue = encoder.encode(value);
    const algorithm = { name: 'PBKDF2' };
    const keyUsages: KeyUsage[] = ['deriveKey'];

    return await crypto.subtle.importKey(format, encodedValue, algorithm, false, keyUsages);
}

export async function encryptFile(file: File, encryptionKey: CryptoKey) {
    const algorithm = { ...encryptionAlgo, iv: encoder.encode(file.name) };
    const bufferSource = await file.arrayBuffer();

    return await crypto.subtle.encrypt(algorithm, encryptionKey, bufferSource);
}

export async function decryptFile(filename: string, fileData: ArrayBuffer, encryptionKey: CryptoKey) {
    const algorithm = { ...encryptionAlgo, iv: encoder.encode(filename) };

    return await crypto.subtle.decrypt(algorithm, encryptionKey, fileData);
}