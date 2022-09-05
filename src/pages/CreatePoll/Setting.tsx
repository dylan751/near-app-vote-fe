import { useState } from 'react';
import { IoTimeOutline } from 'react-icons/io5';
import { Poll } from '../../recoil/create-poll/PollsState';
import { useRecoilState } from 'recoil';
import { convertDate, convertDateSeconds, convertHoursSeconds } from '../../utils/HandleDate';
// import { OptionsCall } from '../../recoil/create-options/OptionsState';

interface props {
  validDate: any;
  setValidDate: Function;
}

const Setting: React.FC<props> = ({ validDate, setValidDate }) => {
  const [poll, setPoll] = useRecoilState(Poll);
  // const options = useRecoilValue(OptionsCall);
  const [hours, setHours] = useState<string>('');
  const [date, setDate] = useState<string>('');
  // useEffect(() => {
  //   setPoll({ ...poll, poll_option_id: options[0].id });
  // }, [options]);
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
                if (!hoursStr) setValidDate({ ...validDate, hours: false });
                else setValidDate({ ...validDate, hours: true });
                let second: number = convertHoursSeconds(hoursStr);
                setHours(hoursStr);
                setPoll({ ...poll, end_at: second + convertDateSeconds(date) });
              }}
            />
            <input
              type="date"
              min={convertDate(new Date().getTime() + 24 * 3600 * 1000)}
              value={date}
              className="bg-primary-20 text-sm flex-1 h-10 py-2 px-3 rounded-lg"
              onChange={(e) => {
                let dateStr = e.target.value;
                if (!dateStr) setValidDate({ ...validDate, date: false });
                else setValidDate({ ...validDate, date: true });
                let second: number = convertDateSeconds(dateStr);
                setDate(dateStr);
                setPoll({ ...poll, end_at: second + convertHoursSeconds(hours) });
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
