import { useEffect, useState } from 'react';
import { IoSave } from 'react-icons/io5';
import { useRecoilValue } from 'recoil';
import { allCriteriaState, getCriteriasById } from '../../../recoil/trending/AllCriteria';
import { allUserState } from '../../../recoil/trending/AllUser';
import { selectOption } from '../../../recoil/trending/Selected';
import { UserInfo } from '../../../recoil/users/UserInfo';
import { SelectionBox } from './SelectionBox';

export interface criterias {
  id: number;
  description: string;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
}

interface Props {
  pollId: number;
  criteriaIds: number[];
  optionId: number;
  setCheckUserVoted: React.Dispatch<React.SetStateAction<boolean>>;
  selected: selectOption[];
  setSelected: React.Dispatch<React.SetStateAction<selectOption[]>>;
  setHomeState: React.Dispatch<React.SetStateAction<string>>;
}
interface users {
  id: number;
  name: string;
}
export const HomeVote = (props: Props) => {
  const { criteriaIds, pollId, optionId, selected, setSelected, setCheckUserVoted, setHomeState } = props;
  const [userOptions, setUserOptions] = useState<users[]>([]);
  const allCriteria = useRecoilValue(allCriteriaState);
  const [arrUserId, setArrUserId] = useState<number[]>([]);
  const allUser = useRecoilValue(allUserState);
  const userInfo = useRecoilValue(UserInfo);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getOptionById = async () => {
      const OptionById = await window.contract.get_poll_option_by_id({ poll_option_id: optionId });
      setArrUserId(OptionById.user_ids);
    };
    getOptionById();
  }, [optionId]);

  useEffect(() => {
    const handleGetOptionById = (arrUserId: number[], allUser: any[]) => {
      let newArr = allUser.filter((User) => {
        return arrUserId.indexOf(User.id as number) >= 0;
      });
      return setUserOptions(newArr);
    };
    handleGetOptionById(arrUserId, allUser);
  }, [arrUserId, allUser]);

  const handleVoted = async () => {
    setLoading(true);
    let newArrSelected: any[] = [];
    // eslint-disable-next-line array-callback-return
    selected.map((select) => {
      newArrSelected.push({ criteria_id: select.criteria_id, user_id: select.id });
    });
    if (userInfo.id !== null) {
      await window.contract.vote({
        args: {
          voted_user_id: userInfo.id,
          poll_id: pollId,
          criteria_user_array: newArrSelected,
        },
        gas: '300000000000000', // attached GAS (optional)
      });
      setLoading(false);
      setHomeState('result');
      setCheckUserVoted(true);
    }
  };

  return (
    <section className="min-h-[472px] w-full relative">
      {loading === true ? (
        <div className="flex justify-center items-center">
          <div>
            <svg className="animate-spin h-5 w-5 mr-3 " viewBox="0 0 24 24"></svg> Voting....
          </div>
        </div>
      ) : (
        <div className="modal-vote max-h-[400px] overflow-y-auto">
          {criteriaIds &&
            getCriteriasById(criteriaIds, allCriteria).map((criteria: criterias, index: number) => (
              <div className="mb-[40px] w-[100%]" key={criteria.id}>
                <p className="text-[16px] font-bold">
                  #{index + 1} {criteria.description}
                </p>
                <SelectionBox
                  criteriaId={criteria.id}
                  listoption={userOptions}
                  selected={selected}
                  setSelected={setSelected}
                  indexCriteria={index}
                  lengthCriterial={criteriaIds.length}
                  pollId={pollId}
                />
              </div>
            ))}
          {/* button Save */}
          <button
            disabled={selected.length < criteriaIds.length}
            className={`w-[120px] h-[40px] text-[14px] font-bold ${
              selected.length < criteriaIds.length ? 'bg-[#ccc]' : 'bg-[rgba(255,255,255,0.1)] hover:opacity-[0.8]'
            }  rounded-[8px] border-[1px] flex items-center justify-center absolute bottom-0 right-0 cursor-pointer`}
            onClick={handleVoted}
          >
            <IoSave className="text-[16px] mr-[9px]" /> save
          </button>
        </div>
      )}
    </section>
  );
};
