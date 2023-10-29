import bip39 from 'bip39';
import { derivePath } from '@demox-labs/aleo-hd-key';
import { PrivateKey } from '@aleohq/sdk';


export default class AleoWallet {
    async generateMnemonic () {
        return bip39.generateMnemonic(128);
    };

    async #mnemonicToSeed (mnemonic) {
        const hexSeed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');

        const { seed } = derivePath("m/44'/0'/0'/0'", hexSeed);
        
        return seed;
    };

    async fromMnemonic (mnemonic) {
        const seed = await this.#mnemonicToSeed(mnemonic);
        const privateKey = PrivateKey.from_seed_unchecked(seed);

        return {
            privateKey: privateKey.to_string(),
            address: privateKey.to_address().to_string()
        };
    };

    async fromPrivateKey (privateKey) {
        const pk = PrivateKey.from_string(privateKey);

        return pk.to_address().to_string();
    };
}