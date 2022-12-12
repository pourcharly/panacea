import pinataSDK, { PinataPinOptions } from '@pinata/sdk';
import { PINATA } from '../env';

const pinata = new pinataSDK(PINATA.API_KEY, PINATA.API_SECRET);

const pinataPinOptions: PinataPinOptions = {
    pinataMetadata: {
        name: "PanaceaNFT",
    },
    pinataOptions: {
        cidVersion: 0,
    }
};

export class NftBody {
    public description: string;
    public image: string;
    public name: string;

    constructor(fileIpfsHash: string, filename: string) {
        this.description = "Ordochain NFT";
        this.image = fileIpfsHash;
        this.name = filename;
    }
}

export async function pinFileToIpfs(file: File) {
    const result = await pinata.pinFileToIPFS(file.stream(), pinataPinOptions);
    return result.IpfsHash;
}

export async function pinJsonToIpfs(nftBody: NftBody) {
    return await pinata.pinJSONToIPFS(nftBody, pinataPinOptions);
}

export function getDataFromIpfs(dataIpfsHash: string) {
    // https://gateway.pinata.cloud/ipfs/
}
export function getJsonFromIpfs(jsonIpfsHash: string) {
    
}
export function getFileFromIpfs(fileIpfsHash: string) {
    
}
