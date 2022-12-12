import Web3 from 'web3';

import * as eccrypto from 'eccrypto';
import { Buffer } from 'buffer';
import { encryptData, decryptData } from "./encryption";
import { Role } from '../enums';

/*
const privateKey = eccrypto.generatePrivate();
encryptData(getPublicKey(privateKey), 'Hello you, world!')
    .then(encryptedData => decryptData(privateKey, encryptedData))
    .then(data => console.log(data.toString()));
*/


const KEYSTORE_KEY = 'panacea_keystore';
const PROFILE_KEY = 'panacea_profile';


export function accountExists() {
    return !!localStorage.getItem(KEYSTORE_KEY);
}

export function createAccount(web3: Web3, password: string) {
    const account = web3.eth.accounts.create();
    const keystore = account.encrypt(password);
    web3.eth.accounts.wallet.add(account);

    localStorage.setItem(KEYSTORE_KEY, JSON.stringify(keystore));
    
    return account;
}

const testKeys = {
    [Role.doctor]: '0x9ce71d74f27d3c522116533bc4c0c8d62a2fd16c4381e125d9e3060b49dcd0f4',
    [Role.patient]: '0x9ed943023dec6f7708005f10daec4ef8091440f43bc3391fa5db5432d8d37397',
    [Role.pharmacist]: '0x75954fd6a10676c756ec943deffb9adc9b7f1d2aa256704c953caac29f252ae2',
}

export function createTestAccount(web3: Web3, password: string, role: Role) {
    const account = web3.eth.accounts.privateKeyToAccount(testKeys[role]);
    const keystore = account.encrypt(password);
    web3.eth.accounts.wallet.add(account);
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
        web3.eth.accounts.wallet.add(account);
        //const publicKey = getPublicKey(account.privateKey);
        //console.log(publicKey);
        return account;
    } catch(e) {
        return null;
    }
}

export function getPublicKey(privateKey: (string | Buffer)) {
    // return eccrypto.getPublic(typeof privateKey === 'string' ? Buffer.from(privateKey) : privateKey);
}

export function saveProfile(profile: any) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getProfile() {
    const profile = localStorage.getItem(PROFILE_KEY) || 'null';
    return JSON.parse(profile);
}