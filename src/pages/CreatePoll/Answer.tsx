import { IoAdd, IoChevronDown, IoChevronUp, IoRefresh } from 'react-icons/io5';
import Avatar from '../../components/Avatar/Avatar';
import { useState } from 'react';
import { OptionsCall } from '../../recoil/create-options/OptionsState';
import { Poll } from '../../recoil/create-poll/PollsState';
import { useRecoilState } from 'recoil';
import { CriteriasCall } from '../../recoil/create-criterias/CriteriaStates';
import { Link } from 'react-router-dom';
interface propsItemCheck {
  id: number | undefined;
  description: string;
}
const ItemCheck: React.FC<propsItemCheck> = ({ id, description }) => {
  const [poll, setPoll] = useRecoilState(Poll);
  let check: boolean = false;
  if (id || id === 0) {
    check = poll.criteria_ids?.indexOf(id) !== -1;
  }
  return (
    <div>
      <input
        type="checkbox"
        id={`criteria-${id}`}
        value={id}
        className="w-4 h-4 mr-2"
        onChange={(e) => {
          const newCriterias: number[] = poll.criteria_ids ? [...poll.criteria_ids] : [];
          if (e.target.checked) {
            newCriterias.push(parseInt(e.target.value));
          } else {
            const index: any = newCriterias.indexOf(parseInt(e.target.value));
            newCriterias.splice(index, 1);
          }
          setPoll({ ...poll, criteria_ids: newCriterias });
        }}
        checked={check}
      />
      <label htmlFor={`criteria-${id}`} className="font-medium text-base cursor-pointer">
        {description}
      </label>
    </div>
  );
};

const Answer: React.FC = () => {
  const [hideOptions, setHideOptions] = useState<Boolean>(false);
  const [options, setOptions] = useRecoilState(OptionsCall);
  const [criteriasCall] = useRecoilState(CriteriasCall);
  const [poll, setPoll] = useRecoilState(Poll);
  const handleSelectOption = (index: number) => {
    let newOptions = [...options];
    let option = newOptions.splice(index, 1);
    newOptions.unshift(option[0]);
    setOptions(newOptions);
    setHideOptions(false);
  };
  return (
    <>
      <div className="mt-6 flex justify-between mb-1">
        <label>Choose Answer options</label>
        {/* <div className="flex">
          <button className="w-[18px] h-[18px] flex justify-center items-center p-[2px] bg-primary-20 rounded mr-2 text-primary-80">
            <IoPencil className="" />
          </button>
          <Link
            to={'/createOptions'}
            className="w-[18px] h-[18px] flex justify-center items-center p-[2px] bg-primary-20 rounded text-primary-80"
          >
            <IoAdd />
          </Link>
        </div> */}
      </div>

      {/* ====== Options ======= */}
      <div className="w-full h-10 bg-primary-20 rounded-xl px-3 relative flex cursor-pointer">
        <div
          className="flex items-center justify-between w-full"
          onClick={() => {
            setHideOptions(!hideOptions);
          }}
        >
          <Avatar name={options[0]?.title} size="small" note={options[0]?.description} />
          {hideOptions ? <IoChevronUp /> : <IoChevronDown />}
        </div>
        {/* Thay thế cho select option */}
        <div
          className="w-full absolute top-10 left-0 bg-greenL rounded-xl overflow-hidden max-h-48 overflow-y-auto"
          hidden={!(hideOptions && true)}
        >
          {options &&
            options.map((item, index) => {
              if (index !== 0)
                return (
                  <div key={index} onClick={() => handleSelectOption(index)}>
                    <Avatar
                      name={item.title}
                      size="small"
                      note={item.description}
                      css="px-2 hover:bg-primary-100 py-1"
                    />
                  </div>
                );
              else return null;
            })}
        </div>
      </div>

      {/* List tiêu chí */}
      <div className="mt-10 flex justify-between mb-1 flex-col">
        <div className="flex justify-between mb-1">
          <label>Choose Answer Criterias</label>
          <div className="flex ">
            <button
              className="w-[18px] h-[18px] flex justify-center items-center p-[2px] bg-primary-20 rounded text-primary-80 mr-2"
              title="Reset all"
              onClick={() => {
                setPoll({ ...poll, criteria_ids: [] });
              }}
            >
              <IoRefresh />
            </button>
            {/* <Link
              to={'/createCriteria'}
              className="w-[18px] h-[18px] flex justify-center items-center p-[2px] bg-primary-20 rounded text-primary-80"
              title="Add criteria"
            >
              <IoAdd />
            </Link> */}
          </div>
        </div>
        <div className="max-h-[340px] overflow-auto">
          {criteriasCall.length > 0 ? (
            criteriasCall.map((item) => {
              return <ItemCheck key={item.id} id={item.id} description={item.description} />;
            })
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export { Answer, ItemCheck };
