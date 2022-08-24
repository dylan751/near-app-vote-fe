import { atom } from 'recoil';
import { Criteria } from '../../pages/Trending/TrendingStates/HomeDescription';

const intialCriteria: Criteria[] = [];
export const allCriteriaState = atom({
  key: 'AllCriteria',
  default: intialCriteria,
});
export const getCriteriasById = (Criteria_ids: number[], listCriteria: Criteria[]) => {
  let newArr = listCriteria.filter((criteria) => {
    return Criteria_ids.indexOf(criteria.id as number) >= 0;
  });
  return newArr;
};
