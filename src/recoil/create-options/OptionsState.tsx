import { atom } from 'recoil';
import { OptionModel } from '../../Model/Poll';
import request from '../../utils/request';
const initialOptionsState: OptionModel = { title: '', user_ids: [] };
export const Option = atom({
  key: 'OPTIONS',
  default: initialOptionsState,
});
const initialOptionsCallState: OptionModel[] = [];
export const OptionsCall = atom({
  key: 'OPTIONS_CALL',
  default: initialOptionsCallState,
});

export const getAllOptions = async () => {
  try {
    // BE API
    // const options = await request.get('/options');
    // return options.data.data;
    // NEAR API
    const options = await window.contract.get_all_poll_options({ limit: 100 });
    return options;
  } catch (error) {
    console.log('Error call API options: ', error);
  }
};
