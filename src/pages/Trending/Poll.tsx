import { IoRocket, IoPizza, IoShieldCheckmark, IoMegaphone } from 'react-icons/io5';
import { useEffect, useState } from 'react';

import people from '../../assets/images/people.svg';
import { HomeDescription } from './TrendingStates/HomeDescription';
import { HomeResult } from './TrendingStates/HomeResult';
import { HomeVote } from './TrendingStates/HomeVote';
// import { UserInfoModel } from '../../Model/User';
import { useRecoilValue } from 'recoil';
import { allUserState, findUserbyId } from '../../recoil/trending/AllUser';
import { selectOption } from '../../recoil/trending/Selected';
import { IsMemberState, UserInfo } from '../../recoil/users/UserInfo';
import Avatar from '../../components/Avatar/Avatar';

interface Props {
  pollInfo: any;
}
export interface ResultInterface {
  poll_id: number;
  user_id: number;
  total_vote: number;
}
function Poll(props: Props) {
  const { pollInfo } = props;
  const [homeState, setHomeState] = useState('description');
  const allUser = useRecoilValue(allUserState);
  const [selected, setSelected] = useState<selectOption[]>([]);
  const [resultById, setResultById] = useState<ResultInterface[]>([]);
  const [totalVote, setTotalVote] = useState<number>(0);
  const isMember = useRecoilValue(IsMemberState);
  const [checkUserVoted, setCheckUserVoted] = useState<boolean>(false);
  const userInfo = useRecoilValue(UserInfo);

  let Today = new Date();
  const HandleSetHomeState = (state: string) => {
    setHomeState(state);
  };

  useEffect(() => {
    const getResultById = async () => {
      const ResultById = await window.contract.get_all_results_by_poll_id({ poll_id: pollInfo.id });
      setResultById(ResultById);
    };
    getResultById();
  }, [pollInfo.id, checkUserVoted]);

  useEffect(() => {
    const checkVoted = async () => {
      if (userInfo.id !== null) {
        const voted = await window.contract.is_voted({
          user_id: userInfo.id,
          poll_id: pollInfo.id,
        });
        setCheckUserVoted(voted);
      }
    };
    checkVoted();
    if (checkUserVoted === true) {
      setHomeState('result');
    }
  }, [userInfo.id, pollInfo.id, checkUserVoted]);

  useEffect(() => {
    const getTotalVote = async () => {
      let newTotal = 0;
      // eslint-disable-next-line array-callback-return

      resultById.map((result: ResultInterface) => {
        newTotal = newTotal + result.total_vote;
      });
      setTotalVote(Math.floor(newTotal / pollInfo.criteria_ids.length));
    };
    getTotalVote();
  }, [resultById, checkUserVoted]);

  return (
    <div className="mb-[5rem] " hidden={pollInfo.end_at < Today}>
      <Avatar size="big" name="BTC Studio" />
      <div className="flex min-w-[434px]  h-[100%] mt-[33px] ">
        <div className="w-[434px] h-full bg-primary-20 p-[34px] rounded-[16px]">
          <h1 className="flex items-start text-[24px] font-semibold mb-[20px]">
            <IoRocket className="text-[32px] mr-[10px]" /> {pollInfo.title}
          </h1>
          {/* content vote */}

          {homeState === 'result' ? (
            <HomeResult criteriaIds={pollInfo.criteria_ids} pollDescription={pollInfo.description} />
          ) : (
            <>
              {homeState === 'description' && (
                <HomeDescription
                  pollDescription={pollInfo.description}
                  criteriaIds={pollInfo.criteria_ids}
                  imgUrl={pollInfo.img_url}
                />
              )}
              {homeState === 'vote' && (
                <HomeVote
                  pollId={pollInfo.id}
                  optionId={pollInfo.poll_option_id}
                  criteriaIds={pollInfo.criteria_ids}
                  selected={selected}
                  setSelected={setSelected}
                  setCheckUserVoted={setCheckUserVoted}
                  setHomeState={setHomeState}
                />
              )}
            </>
          )}

          <hr className="w-[100%] border-[rgba(255,255,255,0.4)] my-[18px] " />
          {/* vote Footer */}
          <div className="flex w-[100%]  justify-center items-center">
            <div className="min-w-[96px] min-h-[40px] flex items-center p-[4px] text-[14px] bg-[rgba(255,255,255,0.2)] rounded-md">
              <button
                disabled={checkUserVoted === true || isMember === false}
                className={`min-w-[88px] min-h-[32px]  mr-[4px] rounded-[6px] ${
                  homeState === 'description' || homeState === 'result' || checkUserVoted === true
                    ? 'bg-[rgba(255,255,255,0.4)]'
                    : 'text-[rgba(255,255,255,0.4)]'
                }`}
                onClick={() => HandleSetHomeState('description')}
              >
                Description
              </button>
              <button
                disabled={!window.walletConnection.isSignedIn() || checkUserVoted === true || isMember === false}
                className={`min-w-[88px] min-h-[32px]  rounded-[6px] flex items-center justify-center ${
                  homeState === 'vote' ? 'bg-[rgba(255,255,255,0.4)]' : 'text-[rgba(255,255,255,0.4)]'
                } `}
                onClick={() => HandleSetHomeState('vote')}
              >
                <IoPizza className="mr-[4px]" /> Vote
              </button>
            </div>
          </div>
        </div>
        {/* Extra info */}
        <div className="flex-[1] h-[100%] pl-[20px] ">
          <div className="text-sm font-[400] py-[20px] min-w-[200px] text-[rgba(255,255,225,0.4)]">
            <p className="flex items-center mb-3">
              <IoShieldCheckmark className="text-[#11DBC5] text-xl mr-[6px]" />
              trust in NEAR Blockchain
            </p>
            <p className="flex items-center mb-3">
              <IoPizza className="text-[rgba(255,255,255,0.8)] text-xl mr-[6px]" />
              {totalVote} users has voted
            </p>
            <div>
              <p className="flex items-center">
                <IoMegaphone className="text-[rgba(255,255,255,0.8)] text-xl mr-[6px]" />
                quick view result
              </p>
              <div className="ml-[30px] mt-[13px]">
                {resultById.slice(0, 3).map((result: ResultInterface, index) => (
                  <p key={index} className="mb-1">
                    # {index + 1} <span> {findUserbyId(result.user_id, allUser)}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Poll;
