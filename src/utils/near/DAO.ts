import { config, executeMultipleTransactions, Transaction, ZERO_POINT_ONE_NEAR } from './near';

const connectToDAO = async (
  criteria_option_id_array: any,
  created_by: number | null,
  title: string | undefined,
  img_url: string | null | undefined,
  description: string | undefined,
  start_at: number | undefined,
  end_at: string | number | undefined,
) => {
  // Execute multi transaction: 1. Call create_poll in BTC's Contract, 2. Call create_poll in DAO's Contract
  // batch transaction
  let createPollCall: Transaction = {
    receiverId: config.contractName,
    functionCalls: [
      {
        methodName: 'create_poll',
        args: {
          criteria_option_id_array,
          created_by,
          title,
          img_url,
          description,
          start_at,
          end_at,
        },
        gas: '300000000000000',
        amount: ZERO_POINT_ONE_NEAR,
      },
    ],
  };

  let transactions: Transaction[] = [createPollCall];

  let createDAOPollCall: Transaction = {
    receiverId: config.daoContractName,
    functionCalls: [
      {
        methodName: 'add_proposal',
        args: {
          proposal: {
            description,
            kind: 'Vote',
          },
        },
        gas: '30000000000000',
        amount: ZERO_POINT_ONE_NEAR,
      },
    ],
  };

  transactions.unshift(createDAOPollCall);

  await executeMultipleTransactions(transactions);
};

export { connectToDAO };
