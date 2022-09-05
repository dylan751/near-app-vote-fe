import { useEffect, useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import { useRecoilState } from 'recoil';
import { selectedCriteriaOption } from '../../Model/Poll';
import { PollUpdateState } from '../../recoil/update-poll/UpdatePolls';
import CreateAnswer from './CreateAnswer';

interface Props {
  setCheckArrayOptionCriteria: React.Dispatch<React.SetStateAction<boolean>>;
}
function Answer(props: Props) {
  const { setCheckArrayOptionCriteria } = props;
  const [pollNeedUpdate, setPollNeedUpdate] = useRecoilState(PollUpdateState);
  const [arrayCriteriaOptionId, setArrayCriteriaOptionId] = useState<selectedCriteriaOption[]>();

  useEffect(() => {
    if (pollNeedUpdate) setArrayCriteriaOptionId(pollNeedUpdate.criteria_option_id_array);
  }, [pollNeedUpdate.criteria_option_id_array]);
  useEffect(() => {
    if (arrayCriteriaOptionId)
      setPollNeedUpdate({ ...pollNeedUpdate, criteria_option_id_array: arrayCriteriaOptionId });
  }, [arrayCriteriaOptionId]);

  useEffect(() => {
    if (arrayCriteriaOptionId) {
      const check = arrayCriteriaOptionId.some(
        (item) => item.criteria_id === undefined || item.poll_option_id === undefined,
      );
      if (check === true) {
        setCheckArrayOptionCriteria(false);
      } else {
        setCheckArrayOptionCriteria(true);
        // setPoll({ ...poll, criteria_option_id_array: arrayCriteriaOptionId });
      }
    }
  }, [arrayCriteriaOptionId]);

  return (
    <div className="my-3 ">
      <div className="overflow-y-auto min-h-[300px] max-h-[450px]">
        {arrayCriteriaOptionId &&
          arrayCriteriaOptionId.map((item, index: number) => {
            return (
              <CreateAnswer
                key={index}
                order={index}
                IdValueCriteria={item && (item.criteria_id as number)}
                IdValueOption={item && (item.poll_option_id as number)}
                arrayCriteriaOptionId={arrayCriteriaOptionId}
                setArrayCriteriaOptionId={setArrayCriteriaOptionId}
              />
            );
          })}
      </div>
      <button
        className="w-full h-12 mt-4 flex justify-center items-center border-[1px] border-primary-80 border-dashed rounded-xl text-primary-80"
        onClick={() => {
          arrayCriteriaOptionId &&
            setArrayCriteriaOptionId([
              ...arrayCriteriaOptionId,
              {
                criteria_id: undefined,
                poll_option_id: undefined,
              },
            ]);
        }}
      >
        <IoAdd className="mr-4 h-6 w-6" />
        Add
      </button>
    </div>
  );
}

export default Answer;
