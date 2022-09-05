import { atom } from 'recoil';
import request from '../../utils/request';
import { CriteriaModel } from '../../Model/Poll';

const initialCriteriasState: CriteriaModel[] = [];
export const Criterias = atom({
  key: 'CRITERIAS',
  default: initialCriteriasState,
});

export const CriteriasCall = atom({
  key: 'CRITERIAS_CALL',
  default: initialCriteriasState,
});

export const getAllCriterias = async (limit: number, from: number) => {
  try {
    // BE API
    // let allCriterias = await request.get('criterias');
    // return allCriterias.data.criterias;
    // NEAR API
    const allCriterias = await window.contract.get_all_criterias({ limit: limit, from_index: from });
    return allCriterias;
  } catch (error) {
    console.warn('Error call API Criterias: ', error);
  }
};
export const getCriteriaById = async (id: number) => {
  try {
    const criteria = await window.contract.get_criteria_by_id({ criteria_id: id });
    return criteria;
  } catch (error) {
    console.warn('Error call API Criterias: ', error);
  }
};
