import { keyStores, Near, utils } from 'near-api-js';
import { functionCall } from 'near-api-js/lib/transaction';
import getConfig from '../../near/config';
import SpecialWallet from './SpecialWallet';
import BN from 'bn.js';

const env: string = process.env.NEAR_ENV || 'development';
export const config: any = getConfig(env);

export const near = new Near({
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  headers: {},
  ...config,
});

export const ONE_YOCTO_NEAR = '0.0000000000000000000001';
export const ZERO_POINT_ONE_NEAR = '0.1';

export const wallet = new SpecialWallet(near, config.contractName);

export const getGas = (gas: string) => (gas ? new BN(gas) : new BN('100000000000000'));
export const getAmount = (amount: string) =>
  amount ? new BN(utils.format.parseNearAmount(amount) as any) : new BN('0');

export interface ViewFunctionOptions {
  methodName: string;
  args?: object;
}

export interface FunctionCallOptions extends ViewFunctionOptions {
  gas?: string;
  amount?: string;
}

export interface Transaction {
  receiverId: string;
  functionCalls: FunctionCallOptions[];
}

export const executeMultipleTransactions = async (transactions: Transaction[], callbackUrl?: string) => {
  const nearTransactions = await Promise.all(
    transactions.map((t, i) => {
      return wallet.createTransaction({
        receiverId: t.receiverId,
        actions: t.functionCalls.map((fc: any) =>
          functionCall(fc.methodName, fc.args, getGas(fc.gas), getAmount(fc.amount)),
        ),
        nonceOffset: i + 1,
      });
    }),
  );

  return await wallet.requestSignTransactions(nearTransactions, callbackUrl);
};
