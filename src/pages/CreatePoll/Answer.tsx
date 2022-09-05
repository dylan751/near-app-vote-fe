import { useEffect, useId, useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import { useRecoilState } from 'recoil';
import { selectedCriteriaOption } from '../../Model/Poll';
import { Poll } from '../../recoil/create-poll/PollsState';
import CreateAnswer from './CreateAnswer';

interface Props {
  setCheckArrayOptionCriteria: React.Dispatch<React.SetStateAction<boolean>>;
}
function Answer(props: Props) {
  const { setCheckArrayOptionCriteria } = props;
  const [poll, setPoll] = useRecoilState(Poll);

  const [arrayCriteriaOptionId, setArrayCriteriaOptionId] = useState<selectedCriteriaOption[]>(
    (poll?.criteria_option_id_array && poll?.criteria_option_id_array) || [
      {
        criteria_id: undefined,
        poll_option_id: undefined,
      },
    ],
  );

  const order = useId();

  useEffect(() => {
    if (arrayCriteriaOptionId) {
      const check = arrayCriteriaOptionId.some(
        (item) => item.criteria_id === undefined || item.poll_option_id === undefined,
      );
      if (check === true) {
        setCheckArrayOptionCriteria(false);
      } else {
        setCheckArrayOptionCriteria(true);
        setPoll({ ...poll, criteria_option_id_array: arrayCriteriaOptionId });
      }
    }
  }, [arrayCriteriaOptionId]);
  useEffect(() => {
    poll?.criteria_option_id_array && setArrayCriteriaOptionId(poll.criteria_option_id_array);
  }, [poll.criteria_option_id_array]);

  return (
    <div className="my-3 ">
      <div className="overflow-y-auto min-h-[300px] max-h-[390px] p-1">
        {arrayCriteriaOptionId &&
          arrayCriteriaOptionId.map((item, index: number) => (
            <CreateAnswer
              key={order + index}
              criteria_id={item.criteria_id}
              option_id={item.poll_option_id}
              order={index}
              index={index}
              arrayCriteriaOptionId={arrayCriteriaOptionId}
              setArrayCriteriaOptionId={setArrayCriteriaOptionId}
            />
          ))}
      </div>

      <button
        className="w-full h-12 mt-4 flex justify-center items-center border-[1px] border-primary-80 border-dashed rounded-xl text-primary-80"
        onClick={() => {
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
