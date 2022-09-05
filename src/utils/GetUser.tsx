import { UserInfoModel } from '../Model/User';

export const getNameUser = (id: number, listUsers: UserInfoModel[]) => {
  const user = listUsers.find((item) => item.id === id);
  return user?.name;
};

export const findUserById = (id: number, listUsers: UserInfoModel[]) => {
  const user = listUsers.find((item) => item.id === id);
  return user;
};
