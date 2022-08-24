import { atom } from 'recoil';
import request from '../../utils/request';
import { CriteriaModel } from '../../Model/Poll';

const initialCriteriasState: CriteriaModel[] = [];
export const Criterias = atom({
  key: 'CRITERIAS',
  default: initialCriteriasState,
});

const initialCriteriasCallState: CriteriaModel[] = [];
export const CriteriasCall = atom({
  key: 'CRITERIAS_CALL',
  default: initialCriteriasCallState,
});

export const getAllCriterias = async () => {
  try {
    // BE API
    // let allCriterias = await request.get('criterias');
    // return allCriterias.data.criterias;
    // NEAR API
    const allCriterias = await window.contract.get_all_criterias({ limit: 100 });
    return allCriterias;
  } catch (error) {
    console.warn('Error call API Criterias: ', error);
  }
};
