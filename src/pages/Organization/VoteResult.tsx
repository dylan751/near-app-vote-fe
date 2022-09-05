import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { PollModel } from '../../Model/Poll';
import { IoRocket, IoTrophy, IoArrowForward, IoArrowBack, IoRemove, IoEllipsisVertical } from 'react-icons/io5';
import { ListUsers, UserInfo } from '../../recoil/users/UserInfo';
import { yyyymmddhhmm } from '../../utils/HandleDate';
import { useParams } from 'react-router-dom';
import Button from '../../components/Button/Button';
import PieChart from '../../components/Chart/Pie';
import Loading from '../../components/Loading';
interface criteriaResultProps {
  criteriaId: number;
  border?: boolean;
}
interface criteriaVote {
  criteria_id: number;
  option: string;
  poll_id: number;
  total_vote: number;
}

const CriteriaResult: React.FC<criteriaResultProps> = ({ criteriaId, border }) => {
  const { pollId } = useParams();
  const [criteriaResult, setCriteriaResult] = useState<criteriaVote[]>([]);
  const [criteriaName, setCriteriaName] = useState<string>('');

  useEffect(() => {
    const getVote = async () => {
      try {
        const data = await window.contract.get_all_results_by_poll_criteria_id({
          poll_id: parseInt(pollId as string),
          criteria_id: criteriaId,
        });
        setCriteriaResult(data);
        const name = await window.contract.get_criteria_by_id({ criteria_id: criteriaId });
        setCriteriaName(name.description);
      } catch (error) {
        alert('Error: ' + error);
      }
    };
    getVote();
  }, []);

  return (
    <div className={`py-6 flex justify-between  min-h-[180px]  ${border ? 'border-b-[1px] border-primary-20' : ''}`}>
      <div>
        <h1 className="font-medium italic text-base flex items-center mb-3">{criteriaName}</h1>
        {criteriaResult ? (
          criteriaResult.map((vote, index) => {
            return (
              <div key={index} className="flex mt-3 items-center">
                <h1 className={`flex mr-4 w-60 items-center`}>
                  <p
                    className={`mr-2 py-[2px] px-1 bg-primary-20 rounded font-bold
                  ${index === 0 ? 'bg-[#FF4545]' : ''} 
                  ${index === 1 ? 'bg-[#FFB746]' : ''}
                  ${index === 2 ? 'bg-[#41D472]' : ''}`}
                  >
                    #{index + 1}
                  </p>
                  {vote.option}
                  {index === 0 ? <IoTrophy className="ml-2 text-yellow-400" /> : <></>}
                </h1>
                <p className="w-40 flex ml-2">
                  Total: {vote.total_vote} <IoRocket className="ml-2" />
                </p>
              </div>
            );
          })
        ) : (
          <h1>No result !</h1>
        )}
      </div>
      <div>
        <PieChart title={criteriaName} data={criteriaResult} />
      </div>
    </div>
  );
};

const VoteResult: React.FC = () => {
  const userInfo = useRecoilValue(UserInfo);
  const { pollId } = useParams();
  const PollId = parseInt(pollId as string);
  let navigate = useNavigate();
  const [poll, setPoll] = useState<PollModel>();
  const listUsers = useRecoilValue(ListUsers);
  const [loading, setLoading] = useState<boolean>(false);
  let startAt: string = '';
  let endAt: string = '';

  if ((new Date(poll?.end_at as number).getFullYear() as number) > 1970) {
    endAt = yyyymmddhhmm(new Date(poll?.end_at as number));
  }
  if ((new Date(poll?.start_at as number).getFullYear() as number) > 1970) {
    startAt = yyyymmddhhmm(new Date(poll?.start_at as number));
  }
  let today = new Date();

  useEffect(() => {
    const getPoll = async () => {
      try {
        const poll = await window.contract.get_poll_by_id({ poll_id: parseInt(pollId as string) });
        setPoll(poll);
      } catch (error) {
        alert('Error: ' + error);
        console.log(error);
      }
    };
    getPoll();
  }, [PollId, listUsers]);
  // delete poll
  const handleDeletePoll = async (id: number) => {
    try {
      setLoading(true);
      await window.contract.delete_poll({
        callbackUrl: window.origin,
        args: {
          poll_id: PollId,
        },
        gas: '300000000000000',
      });
      setLoading(false);
      navigate(-1);
    } catch (error) {
      setLoading(false);
      alert(error);
    }
  };
  // update poll
  const handleUpdatePoll = (id: number) => {
    navigate(`/update-poll/${id}`);
  };
  return (
    <div className="mt-4">
      <Fragment>
        <div className="flex justify-between">
          <div className="flex items-center  mb-6">
            <h1 className="text-xl font-bold flex items-center">
              <IoRocket className="mr-2" />
              {poll?.title}
            </h1>
            <div className="flex ml-40">
              <p className="mr-2 ">Start: {startAt}</p>
              <span className="py-1 border-r-2 border-primary-20"></span>
              <p className="ml-2">End: {endAt}</p>
            </div>
          </div>
          {/* Handle buttons */}
          {(poll?.end_at as number) > today.getTime() && userInfo.role === 'Admin' && (
            <div className="flex p-2 justify-around mr-[4rem]">
              <Button
                title="Delete"
                upcase={true}
                group={false}
                outline={true}
                active={false}
                css="border-[#f87171] text-[#f87171] mx-[4px]"
                handle={() => window.confirm('Bạn chắc chắn muốn xóa chứ') && handleDeletePoll(PollId)}
              />
              <Button
                title="Update"
                upcase={true}
                group={false}
                outline={true}
                active={false}
                css="border-[#22d3ee] text-[#22d3ee] mx-[4px]"
                handle={() => handleUpdatePoll(PollId)}
              />
            </div>
          )}
        </div>
        <div className="mb-8">
          {poll?.description && poll?.description.split('\n').map((i, key) => <div key={key}>{i}</div>)}
        </div>
      </Fragment>
      {poll?.criteria_option_id_array?.map((item, index) => {
        return (
          <CriteriaResult
            key={item.criteria_id}
            criteriaId={item.criteria_id as number}
            border={index !== (poll?.criteria_option_id_array?.length as number) - 1}
          />
        );
      })}
      {loading === true && <Loading />}
    </div>
  );
};

export default VoteResult;
