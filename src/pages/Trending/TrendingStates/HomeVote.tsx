import { useEffect, useState } from 'react';
import { IoSave } from 'react-icons/io5';
import { useRecoilState, useRecoilValue } from 'recoil';
import Button from '../../../components/Button/Button';
import { selectedCriteriaOption } from '../../../Model/Poll';
import { OptionsCall } from '../../../recoil/create-options/OptionsState';
import { allCriteriaState, findCriteriaById } from '../../../recoil/trending/AllCriteria';
import { selectOption } from '../../../recoil/trending/Selected';
import { UserInfo } from '../../../recoil/users/UserInfo';
import { SelectionBox } from './SelectionBox';
import ReactLoading from 'react-loading';

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
  optionIds: number[];
  setCheckUserVoted: React.Dispatch<React.SetStateAction<boolean>>;
  selected: selectOption[];
  setSelected: React.Dispatch<React.SetStateAction<selectOption[]>>;
  setHomeState: React.Dispatch<React.SetStateAction<string>>;
  arrayCriteriaOptionId: selectedCriteriaOption[];
}
export const HomeVote = (props: Props) => {
  const {
    criteriaIds,
    pollId,
    optionIds,
    selected,
    setSelected,
    setCheckUserVoted,
    setHomeState,
    arrayCriteriaOptionId,
  } = props;
  const allCriteria = useRecoilValue(allCriteriaState);
  // const allUser = useRecoilValue(allUserState);
  const [options, setOptions] = useRecoilState(OptionsCall);
  const userInfo = useRecoilValue(UserInfo);
  const [loading, setLoading] = useState(false);
  const [optionOfCriteria, setOptionOfCriteria] = useState<any[]>();

  useEffect(() => {
    const handleGetOptionById = (arrOptionIds: number[], listOption: any[]) => {
      let newArr = listOption.filter((option) => {
        return arrOptionIds.indexOf(option.id as number) >= 0;
      });
      return setOptionOfCriteria(newArr);
    };
    handleGetOptionById(optionIds, options);
  }, [optionIds, options]);

  const handleVoted = async () => {
    setLoading(true);
    let newArrSelected: any[] = [];
    // eslint-disable-next-line array-callback-return
    selected.map((select) => {
      newArrSelected.push({ criteria_id: select.criteria_id, option: select.name });
    });
    if (userInfo.id !== null) {
      await window.contract.vote({
        args: {
          voted_user_id: userInfo.id,
          poll_id: pollId,
          criteria_option_array: newArrSelected,
        },
        gas: '300000000000000', // attached GAS (optional)
      });
      setLoading(false);
      setHomeState('result');
      setCheckUserVoted(true);
    }
  };

  return (
    <section className="min-h-[472px] w-full relative mt-6">
      {loading === true ? (
        <div className="flex justify-center items-center">
          <ReactLoading
            type="bubbles"
            color="#eee"
            height={'20%'}
            width={50}
            className="absolute top-1 left-1/2 -translate-x-1/2	"
          />

        </div>
      ) : (
        <div className="modal-vote max-h-[400px] overflow-y-auto">
          {arrayCriteriaOptionId &&
            arrayCriteriaOptionId.map((item: any, index: number) => {
              return (
                <div className="mb-[40px] w-[100%]" key={index}>
                  <div className="text-[16px] font-bold">
                    <p>
                      {' '}
                      #{index + 1} {findCriteriaById(item.criteria_id, allCriteria)}
                    </p>
                  </div>
                  <SelectionBox
                    criteriaId={item.criteria_id}
                    optionId={item.poll_option_id}
                    selected={selected}
                    setSelected={setSelected}
                    indexCriteria={index}
                    lengthCriterial={criteriaIds.length}
                    pollId={pollId}
                  />
                </div>
              );
            })}
          {/* button Save */}
          <Button
            title={
              <div className="flex items-center">
                <IoSave className="text-[16px] mr-[9px]" /> Save
              </div>
            }
            css="absolute bottom-0 right-0"
            idDisable={selected.length < criteriaIds.length}
            upcase={true}
            active={false}
            outline={true}
            handle={handleVoted}
          />
        </div>
      )}
    </section>
  );
};
