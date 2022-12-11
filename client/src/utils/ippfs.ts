import pinataSDK from '@pinata/sdk';
import { PINATA } from '../env';

const pinata = new pinataSDK(PINATA.API_KEY, PINATA.API_SECRET);

const options = {
    pinataMetadata: {
        name: "PanaceaNFT",
    }
};

export async function pinFileToIpfs(file: File) {
    const result = await pinata.pinFileToIPFS(file.stream(), options);
    return result.IpfsHash;
}

export async function pinJsonToIpfs(nftBody: any) {
    return await pinata.pinJSONToIPFS(nftBody, options);
}

export function getNftBody(fileIpfsHash: string, filename: string) {
    return {
        description: "Ordochain NFT",
        image: fileIpfsHash,
        name: filename,
    };
}
