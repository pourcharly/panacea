import * as IPFS from 'ipfs-core';


export class IpfsService {
    private node: IPFS.IPFS | void = void 0;


    async init() {
        if (!this.node) {
            this.node = await IPFS.create({ repo: 'Panacea' })
                .catch(() => console.log('Panacea IPFS Node already exists.'));
        }
    }

    async add(data: string): Promise<any> {
        if (!this.node) {
            return Promise.reject('No IPFS Node');
        }
        const results = await this.node.add(data);

        return results;
    }

    async get(cid: string): Promise<string> {
        if (!this.node) {
            return Promise.reject('No IPFS Node');
        }
        const stream = this.node.cat(cid);
        const decoder = new TextDecoder();
        let data = '';

        for await (const chunk of stream) {
            // chunks of data are returned as a Uint8Array, convert it back to a string
            data += decoder.decode(chunk, { stream: true });
        }

        return data;
    }
};