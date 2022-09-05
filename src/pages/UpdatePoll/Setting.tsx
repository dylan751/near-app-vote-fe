import { useEffect, useState } from 'react';
import { IoTimeOutline } from 'react-icons/io5';
import { useRecoilState } from 'recoil';
import { convertDate, convertHours, convertDateSeconds, convertHoursSeconds } from '../../utils/HandleDate';
import { PollUpdateState } from '../../recoil/update-poll/UpdatePolls';

interface props {
  validDate: any;
  setValidDate: Function;
}

const Setting: React.FC<props> = ({ validDate, setValidDate }) => {
  const [pollNeedUpdate, setPollNeedUpdate] = useRecoilState(PollUpdateState);
  const [hours, setHours] = useState<string>('');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    if (pollNeedUpdate) {
      setHours(convertHours(pollNeedUpdate?.end_at as number));
      setDate(convertDate(pollNeedUpdate?.end_at as number));
    }
  }, [pollNeedUpdate, hours, date]);

  return (
    <>
      <h2 className="mt-10 text-xl font-bold text-white">Setting</h2>
      <div className="mt-5 w-full h-[160px] rounded-lg bg-primary-10 px-6 py-8">
        {/* End Date */}
        <div>
          <div className="flex items-center w-full">
            <div className="p-[2px] rounded bg-greenL">
              <IoTimeOutline className="text-greenL bg-white rounded-full " />
            </div>
            <div className="ml-2 flex justify-between flex-1 items-center">
              <span className="text-sm">End Date</span>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <input
              type="time"
              value={hours}
              className="bg-primary-20 text-sm flex-2 mr-3 h-10 py-2 px-3 rounded-lg"
              onChange={(e) => {
                let hoursStr = e.target.value;
                let second: number = convertHoursSeconds(hoursStr);
                setHours(hoursStr);
                setPollNeedUpdate({ ...pollNeedUpdate, end_at: second + convertDateSeconds(date) });
              }}
            />
            <input
              type="date"
              min={convertDate(new Date().getTime() + 24 * 3600 * 1000)}
              value={date}
              className="bg-primary-20 text-sm flex-1 h-10 py-2 px-3 rounded-lg"
              onChange={(e) => {
                let dateStr = e.target.value;
                let second: number = convertDateSeconds(dateStr);
                setDate(dateStr);
                setPollNeedUpdate({ ...pollNeedUpdate, end_at: second + convertHoursSeconds(hours) });
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
