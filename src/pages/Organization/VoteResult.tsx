import { useEffect, useState } from 'react';
import { PollModel } from '../../Model/Poll';
import { ListUsers } from '../../recoil/users/UserInfo';
import { useRecoilValue } from 'recoil';
import { IoRocket, IoTrophy } from 'react-icons/io5';
import { getNameUser } from '../../utils/GetUser';
import { yyyymmddhhmm } from '../../utils/HandleDate';
import { useParams } from 'react-router-dom';

interface userVote {
  userName: string;
  total: number;
}

const VoteResult: React.FC = () => {
  const { pollId } = useParams();
  const [poll, setPoll] = useState<PollModel>();
  const listUsers = useRecoilValue(ListUsers);
  const [listUserVote, setListUserVote] = useState<userVote[]>([]);
  let startAt: string = '';
  let endAt: string = '';

  if ((new Date(poll?.end_at as number).getFullYear() as number) > 1970) {
    endAt = yyyymmddhhmm(new Date(poll?.end_at as number));
  }
  if ((new Date(poll?.start_at as number).getFullYear() as number) > 1970) {
    startAt = yyyymmddhhmm(new Date(poll?.start_at as number));
  }

  useEffect(() => {
    const getPoll = async () => {
      const pollGet = await window.contract.get_poll_by_id({ poll_id: parseInt(pollId as string) });
      console.log(pollGet);

      const result = await window.contract.get_all_results_by_poll_id({ poll_id: parseInt(pollId as string) });

      const listUserVoteMap = await result.map((item: any) => {
        return {
          userName: getNameUser(item.user_id, listUsers),
          total: item.total_vote,
        };
      });
      setListUserVote(listUserVoteMap);
      setPoll(pollGet);
    };
    getPoll();
  }, []);
  return (
    <div className="mt-4">
      <div className="">
        <div className="flex items-center">
          <h1 className="text-xl font-bold flex items-center mb-2">
            <IoRocket className="mr-2" />
            {poll?.title}
          </h1>
          <div className="flex ml-40">
            <p className="mr-2">Start: {startAt}</p>
            <p className="ml-2">End: {endAt}</p>
          </div>
        </div>
        <div>{poll?.description && poll?.description.split('\n').map((i, key) => <div key={key}>{i}</div>)}</div>
      </div>
      <div className="mt-4">
        {listUserVote ? (
          listUserVote.map((vote, index) => {
            return (
              <div key={index} className="flex mt-2 items-center">
                <h1 className={`flex mr-4 w-60 items-center`}>
                  <p
                    className={`mr-2 py-[2px] px-1 bg-primary-20 rounded font-bold
                    ${index === 0 ? 'bg-green-500' : ''} 
                    ${index === 1 ? 'bg-orange-500' : ''}
                    ${index === 2 ? 'bg-blue-500' : ''}`}
                  >
                    #{index + 1}
                  </p>
                  {vote.userName}
                  {index === 0 ? <IoTrophy className="ml-2 text-yellow-400" /> : <></>}
                </h1>
                <p className="w-40 flex ml-2">
                  Total: {vote.total} <IoRocket className="ml-2" />
                </p>
              </div>
            );
          })
        ) : (
          <h1>Chưa có thông tin !</h1>
        )}
      </div>
    </div>
  );
};

export default VoteResult;
