import { atom } from 'recoil';
import { PollModel } from '../../Model/Poll';

const initialPollUpdateState: PollModel = {
  id: undefined,
  title: '',
  description: '',
  start_at: 0,
  end_at: 0,
};

export const PollUpdateState = atom({
  key: 'Poll_Update',
  default: initialPollUpdateState,
});
