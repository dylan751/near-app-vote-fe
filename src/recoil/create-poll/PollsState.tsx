import { atom } from 'recoil';
import { PollModel } from '../../Model/Poll';
// import request from '../../utils/request';

const initialPollsState: PollModel = {
  title: '',
  description: '',
  end_at: 0,
  // criteria_option_id_array: undefined,
};

const initialPollsCallState: PollModel[] = [];

export const Poll = atom({
  key: 'POLL',
  default: initialPollsState,
});

export const PollsCall = atom({
  key: 'POLLS_CALL',
  default: initialPollsCallState,
});
export const getAllPolls = async (limit: number, from: number) => {
  try {
    // BE API
    // const polls = await request.get('/polls');
    // return polls.data.data;
    // NEAR API
    const allPolls = await window.contract.get_all_polls({ limit: limit, from_index: from });
    return allPolls;
  } catch (error) {
    alert('Error call API polls: ' + error);
  }
};
export const getTotalPolls = async () => {
  try {
    const total = await window.contract.poll_total_supply();
    return total;
  } catch (error) {
    alert(error);
  }
};
