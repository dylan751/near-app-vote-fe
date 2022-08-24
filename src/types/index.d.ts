export {};

declare global {
  interface Window {
    nearInitPromise: any;
    walletConnection: any;
    contract: any;
    accountId: String;
  }
}
