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
export const findCriteriaById = (criteria_id: number, listCriteria: Criteria[]) => {
  let criteria = listCriteria.find((item) => {
    if (item.id === criteria_id) return item.description;
  });
  return criteria?.description;
};
