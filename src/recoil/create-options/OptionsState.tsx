import { atom } from 'recoil';
import { OptionModel } from '../../Model/Poll';
import request from '../../utils/request';
const initialOptionsState: OptionModel = { title: '', options: [''], description: '' };
export const Options = atom({
  key: 'OPTIONS',
  default: initialOptionsState,
});
const initialOptionsCallState: OptionModel[] = [];
export const OptionsCall = atom({
  key: 'OPTIONS_CALL',
  default: initialOptionsCallState,
});

export const getAllOptions = async (limit: number, from: number) => {
  try {
    // BE API
    // const options = await request.get('/options');
    // return options.data.data;
    // NEAR API
    const options = await window.contract.get_all_poll_options({ limit: limit, from_index: from });
    return options;
  } catch (error) {
    console.log('Error call API options: ', error);
  }
};

export const getTotalOptions = async () => {
  try {
    const total = await window.contract.poll_option_total_supply();
    return total;
  } catch (error) {}
};
