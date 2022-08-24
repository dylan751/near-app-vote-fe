import { useRecoilState, useRecoilValue } from 'recoil';
import { descriptionImage } from '../../../assets/images';

import { allCriteriaState, getCriteriasById } from '../../../recoil/trending/AllCriteria';
import { PollInfoState } from '../../../recoil/trending/AllPoll';

interface Props {
  pollDescription: string;
  criteriaIds: number[];
  imgUrl: string;
}
export interface Criteria {
  id: number;
  description: string;
}
export const HomeDescription = (props: Props) => {
  const { pollDescription, criteriaIds, imgUrl } = props;
  const pollInfos: any = useRecoilValue(PollInfoState);
  const [allCriteria, setAllCriteria] = useRecoilState(allCriteriaState);

  return (
    <section className="w-[366px] min-h-[472px]">
      {pollInfos && (
        <>
          <div className="w-[363px] h-[241px] rounded-[32px] object-cover bg-center overflow-hidden my-[20px] bg-[#ccc]">
            <img src={imgUrl ? imgUrl : descriptionImage} alt="" className="w-[363px] h-[241px] object-cover " />
          </div>
          <div className="text-[14px]  font-[400] leading-[26px]">
            <div className="mb-[8px] max-h-[80px] overflow-y-auto ">
              <div>
                {pollDescription.split('\n').map((i, key) => (
                  <div key={key}>{i}</div>
                ))}
              </div>
            </div>
            {criteriaIds &&
              getCriteriasById(criteriaIds, allCriteria).map((criteria: any, index) => (
                <p key={index}>
                  #{index + 1} {criteria.description}
                </p>
              ))}
          </div>
        </>
      )}
    </section>
  );
};
export default HomeDescription;
