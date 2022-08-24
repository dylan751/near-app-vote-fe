import { atom } from 'recoil';

export const SwitchMenuOrganization = atom({
  key: 'SWITCH_MENU_ORGANIZATION',
  default: {
    orverview: true,
    members: false,
    polls: false,
    answerOptions: false,
  },
});
