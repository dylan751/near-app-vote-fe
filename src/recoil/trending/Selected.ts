import { atom } from 'recoil';

export interface selectOption {
  id?: number;
  name: string;
  description?: string;
  criteria_id?: number;
  indexCriteria?: number;
  poll_id?: number;
}
const initialSelectedState: selectOption[] = [];
export const SelectedState = atom({
  key: 'Selected',
  default: initialSelectedState,
});
