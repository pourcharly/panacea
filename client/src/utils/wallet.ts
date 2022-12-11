import Web3 from "web3";

import * as eccrypto from 'eccrypto';
import { Buffer } from 'buffer';
import { encryptData, decryptData } from "./encryption";


/*
var privateKeyA = eccrypto.generatePrivate();
var publicKeyA = eccrypto.getPublic(privateKeyA);

// Encrypting the message for A.
eccrypto.encrypt(publicKeyA, Buffer.from("msg to a")).then(function(encrypted) {
    // A decrypting the message.
    eccrypto.decrypt(privateKeyA, encrypted).then(function(plaintext) {
      console.log("Message to part A:", plaintext.toString());
    });
});
*/
const privateKey = eccrypto.generatePrivate();
encryptData(getPublicKey(privateKey), 'Hello you, world!')
    .then(encryptedData => decryptData(privateKey, encryptedData))
    .then(data => console.log(data.toString()));



const KEYSTORE_KEY = 'panacea_keystore';
const PROFILE_KEY = 'panacea_profile';

export function accountExists() {
    return !!localStorage.getItem(KEYSTORE_KEY);
}

export function createAccount(web3: Web3, password: string) {
    const account = web3.eth.accounts.create();
    const keystore = account.encrypt(password);
    localStorage.setItem(KEYSTORE_KEY, JSON.stringify(keystore));
    return account;
}

export function getAccount(web3: Web3, password: string) {
    const keystoreStr = localStorage.getItem(KEYSTORE_KEY) || 'null';
    const keystore = JSON.parse(keystoreStr);

    if (!keystore) {
        return null;
    }

    try {
        const account = web3.eth.accounts.decrypt(keystore, password);
        //const publicKey = getPublicKey(account.privateKey);
        //console.log(publicKey);
        return account;
    }
    catch(e) {
        return null;
    }
}

export function getPublicKey(privateKey: (string | Buffer)) {
    return eccrypto.getPublic(typeof privateKey === 'string' ? Buffer.from(privateKey) : privateKey);
}

export function saveProfile(profile: any) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getProfile() {
    const profile = localStorage.getItem(PROFILE_KEY) || 'null';
    return JSON.parse(profile);
}