import { useEffect, useState } from 'react';
import { IoChevronDown } from 'react-icons/io5';
import people from '../../../assets/images/people.svg';
import { selectOption } from '../../../recoil/trending/Selected';
interface Props {
  optionId: number;
  selected: selectOption[];
  setSelected: React.Dispatch<React.SetStateAction<selectOption[]>>;
  indexCriteria: number;
  lengthCriterial: number;
  criteriaId: number;
  pollId: number;
}

export const SelectionBox = (props: Props) => {
  const { optionId, selected, setSelected, indexCriteria, lengthCriterial, criteriaId, pollId } = props;
  const [isActive, setIsActive] = useState<boolean>(false);
  const [listOption, setListOption] = useState<string[]>([]);

  useEffect(() => {
    const getPollOptionById = async () => {
      const listOption = await window.contract.get_poll_option_by_id({ poll_option_id: optionId });
      setListOption(listOption.options);
    };
    getPollOptionById();
  }, [optionId]);
  const handleChoseOption = (option: any, indexCriteria: number, criteriaId: number): void => {
    let listSelected: selectOption[] = [...selected];
    let newOption = {
      poll_id: pollId,
      criteria_id: criteriaId,
      name: option,
      indexCriteria: indexCriteria,
    };

    if (listSelected.length === lengthCriterial) {
      listSelected.splice(indexCriteria, 1, newOption);
      setSelected(listSelected);
    } else {
      listSelected[indexCriteria] = newOption;
      setSelected(listSelected);
    }
    setIsActive(false);
  };

  return (
    <div className="mt-[10px] w-[100%] h-[40px] rounded-[8px]">
      <div
        className=" relative w-[100%]  px-[20px]  py-[6px] text-[14px] font-[400] text-[rgba(255,255,255,0.4)]
      bg-[rgba(255,255,255,0.2)] cursor-pointer rounded-[8px] transition ease-in-out  m-0
      flex items-center justify-between"
        onClick={() => setIsActive(!isActive)}
      >
        <div className="flex items-center min-h-[40px]">
          {selected.filter((item) => item.poll_id) && !selected[indexCriteria] ? (
            <p>Select an item</p>
          ) : (
            <>
              {selected[indexCriteria] && <img src={people} className="w-[24px] h-[24px]" alt="" />}

              <div>
                <p className="text-[14px] font-bold text-[#fff] mx-1">{selected[indexCriteria].name}</p>
              </div>
            </>
          )}
        </div>
        <IoChevronDown className="text-[16px]" />
      </div>
      <div className={`absolute w-[100%] mt-[2px] bg-[#05293C] rounded-[8px] z-10`}>
        {isActive && (
          <div className=" rounded-[4px] overflow-hidden max-h-[110px] overflow-y-auto">
            {listOption &&
              listOption?.map((option: any) => (
                <div
                  className="flex items-center  px-[20px] py-[8px] cursor-pointer hover:opacity-[0.8] border-b-[0.5px] border-[rgba(255,255,255,0.2)]  "
                  key={option}
                  onClick={() => handleChoseOption(option, indexCriteria, criteriaId)}
                >
                  <img src={people} className="w-[24px] h-[24px]" alt="" />
                  <div>
                    <p className="text-[14px] font-bold text-[#fff] mx-1">{option}</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
