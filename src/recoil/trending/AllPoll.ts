import { atom } from 'recoil';
import { PollInterface } from '../../pages/Trending';

const initialListPolls: PollInterface[] = [];
export const listPolls = atom({
  key: 'listPolls',
  default: initialListPolls,
});

const initialPollInfo: any[] = [];
export const PollInfoState = atom({
  key: 'PollInfo',
  default: initialPollInfo,
});
