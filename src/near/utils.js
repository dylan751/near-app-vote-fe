import { connect, Contract, keyStores, WalletConnection } from 'near-api-js';
import getConfig from './config';

window.Buffer = window.Buffer || require('buffer').Buffer;
const nearConfig = getConfig(process.env.REACT_APP_NODE_ENV || 'development');

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(
    Object.assign(
      {
        deps: {
          keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        },
      },
      nearConfig,
    ),
  );

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near);

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId();

  // Initializing our contract APIs by contract name and configuration
  window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
    // Test only
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: [
      'get_all_users',
      'get_user_by_id',
      'get_all_criterias',
      'get_criteria_by_id',
      'get_all_polls',
      'get_poll_by_id',
      'get_all_poll_options',
      'get_poll_option_by_id',
      'get_all_results',
      'get_all_results_by_poll_id',
      'get_user_by_wallet_address',
      'is_voted',
      'get_all_is_user_votes',
    ],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: [
      'create_user',
      'create_criteria',
      'create_criterias',
      'create_poll',
      'create_poll_option',
      'create_result',
      'update_user',
      'update_criteria',
      'update_poll',
      'vote',
      'delete_user',
      'delete_criteria',
      'delete_poll',
      'delete_poll_option',
      'delete_result',
    ],
  });
}

export function logout() {
  window.walletConnection.signOut();
  // reload page
  window.location.replace(window.location.origin);
  // window.location.replace(window.location.origin + window.location.pathname);
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn(nearConfig.contractName);
}

// export async function set_greeting(message) {
//   let response = await window.contract.set_greeting({
//     args: { message: message },
//   });
//   return response;
// }

// export async function get_greeting() {
//   let greeting = await window.contract.get_greeting();
//   return greeting;
// }
