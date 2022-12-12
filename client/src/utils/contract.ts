import Web3 from "web3";
import { Account } from 'web3-core';


export default class Contract {
    private _web3?: Web3
    private _contract?: any;
    private _address?: string;
    private _account?: Account;

    constructor(web3: Web3, networkID: number) {
        const artifact = require("../contracts/DoctorFactory.json");
        const { abi } = artifact;

        this._web3 = web3;

        try {
            this._address = artifact.networks[networkID].address;
            this._contract = new web3.eth.Contract(abi, this._address);
        } catch (err) {
            console.error(err);
        }
    }

    setAccount(account: any) {
        this._account = account;
    }

    async createDoctorCollection(
        doctorAddress: string,
        doctorName: string
    ) {
        const initials = doctorName[0] + (doctorName.match(/\s(\w)/)?.[1] || '');
        return await this.send(this._contract.methods.createDoctorCollection(doctorAddress, doctorName, initials));
    }

    async mintPrescription(patientAddress: string, tokenURI: string) {
        return await this.send(this._contract.methods.mintPrescription(patientAddress, tokenURI));
    }

    async test() {
        return await this.send(this._contract.methods.test());
    }

    private async send(tx_builder: any) {
        if (!this._account) {
            return;
        }
        const account = this._account;
        const encoded_tx = tx_builder.encodeABI();
        const gas = await this.estimateGasAmount();
        const transactionObject = {
            gas,
            from: account.address,
            to: this._address,
            data: encoded_tx,
            nonce: 0,
        };
        if (!this._web3) {
            return;
        }
        const web3 = this._web3;
        
        return new Promise((resolve, reject) => {
            web3.eth.accounts.signTransaction(transactionObject as any, account.privateKey, (error, signedTx) => {
                if (error) {
                    reject(error);
                } else if (!signedTx?.rawTransaction) {
                    reject(new Error('Signed transaction error'));
                } else {
                    web3.eth.sendSignedTransaction(signedTx.rawTransaction).on('receipt', function (receipt) {
                        resolve(receipt);
                    });
                }
            });
        });
    }
    private async estimateGasAmount() {
        return new Promise((resolve, reject) => {
            this._contract.methods.test()
            .estimateGas({}, (error: Error, estimatedGas: any) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(estimatedGas);
            });
        })
    }
}

export {};