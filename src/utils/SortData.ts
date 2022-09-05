export const sortUserList = (listUser: any) => {
  return listUser.map((user: any) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletAddress: user.user_wallet.wallet_address,
    };
  });
};

export const sortByCreatedDate = (list: any) => {
  return list.sort((a: any, b: any) => {
    return b.created_at - a.created_at;
  });
};
