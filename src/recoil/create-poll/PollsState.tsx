import { atom } from 'recoil';
import { PollModel } from '../../Model/Poll';
import request from '../../utils/request';

const initialPollsState: PollModel = {
  title: '',
  description: '',
  end_at: 0,
  criteria_ids: [],
  poll_option_id: undefined,
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
export const getAllPolls = async () => {
  try {
    // BE API
    // const polls = await request.get('/polls');
    // return polls.data.data;
    // NEAR API
    const allPolls = await window.contract.get_all_polls({ limit: 100 });
    return allPolls;
  } catch (error) {
    console.log('Error call API polls: ', error);
  }
};
