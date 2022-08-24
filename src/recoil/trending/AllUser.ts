import { atom } from 'recoil';
import { UserInfoModel } from '../../Model/User';

export const allUserState = atom({
  key: 'allUser',
  default: [],
});

export const findUserbyId = (id: number, listUser: UserInfoModel[]) => {
  let user = listUser.find((user: UserInfoModel) => id === user.id);

  return user?.name;
};
