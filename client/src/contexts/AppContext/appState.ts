import Web3 from "web3";
import { AppAction, Role } from "../../enums";
import { Account } from 'web3-core';
import { createAccount, createTestAccount, getAccount, getProfile, saveProfile } from "../../utils/wallet";
import Contract from "../../utils/contract";

export type Action<A = any> = {
    type: A,
    data?: any,
};

export type AppState = {
    web3: Web3,
    networkID: number,
    contract: Contract
    account?: Account,
    profile?: { name: string, secuNum?: string, role: string },
    role?: Role,
};


const isLocalhost = (document.location.hostname === 'localhost');
const provider = isLocalhost ? 'ws://localhost:8545' : 'https://goerli.infura.io/v3/0fc73fad4750436298a2f12dd027071e';
const web3 = new Web3(provider);
const networkID = isLocalhost ? 1670789990300 : 5;
const contract = new Contract(web3, networkID);
  
export const initialAppState: AppState = {
  web3,
  networkID,
  contract,
  account: undefined,
  profile: undefined,
  role: undefined,
};
  
export const appReducer = (state: AppState, action: Action<AppAction>) => {
  const { type, data } = action;
  const { web3 } = state;
  let password: string, account: (Account | null), profile: any;
  
  switch (type) {

    case AppAction.CreateWallet:
      const { role, name, secuNum } = data;
      password = data.password;
      // account = createAccount(web3, password);
      account = createTestAccount(web3, password, role);
      contract.setAccount(account);
      profile = { name, secuNum, role };
      saveProfile(profile);
      return { ...state as AppState, account, profile, role };

    case AppAction.OpenWallet:
      password = data.password;
      account = getAccount(web3, password);
      if (!account) {
        throw new Error('wrong password');
      }
      contract.setAccount(account);
      profile = getProfile();
      return { ...state as AppState, account, profile, role: profile.role };

    case AppAction.CloseWallet:
      return { ...state, account: undefined, profile: undefined, role: undefined };

    default:
      throw new Error("Undefined reducer action type");
  }
};

  