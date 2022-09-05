import { atom } from 'recoil';
import { UserInfoModel } from '../../Model/User';
const initUserInfo: UserInfoModel = { id: null, name: null, email: null, role: null, walletAddress: null };
export const UserInfo = atom({
  key: 'USER_INFO',
  default: initUserInfo,
});

const initListUsers: UserInfoModel[] = [];
export const ListUsers = atom({
  key: 'LIST_USERS',
  default: initListUsers,
});

export const IsMemberState = atom({
  key: 'isMember',
  default: false,
});

export const getAllUsers = async (limit: number, from: number) => {
  try {
    // BE API
    // let allCriterias = await request.get('criterias');
    // return allCriterias.data.criterias;
    // NEAR API
    const allUsers = await window.contract.get_all_users({ limit: limit, from_index: from });
    return allUsers;
  } catch (error) {
    alert('Error call API Users: ' + error);
  }
};
