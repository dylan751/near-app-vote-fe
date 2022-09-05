import { IoRocket, IoPizza, IoShieldCheckmark, IoMegaphone } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { HomeDescription } from './TrendingStates/HomeDescription';
import { HomeResult } from './TrendingStates/HomeResult';
import { HomeVote } from './TrendingStates/HomeVote';
import { useRecoilValue } from 'recoil';
import { allUserState } from '../../recoil/trending/AllUser';
import { selectOption } from '../../recoil/trending/Selected';
import { IsMemberState, UserInfo } from '../../recoil/users/UserInfo';
import Modal from '../../components/Modal/Modal';
import Avatar from '../../components/Avatar/Avatar';
import BtnGroup from '../../components/BtnGroup/BtnGroup';
import Button from '../../components/Button/Button';
import { Link } from 'react-router-dom';

interface Props {
  pollInfo: any;
  page: number;
}
export interface ResultInterface {
  poll_id: number;
  user_id: number;
  total_vote: number;
}
function Poll(props: Props) {
  const { pollInfo, page } = props;
  const [homeState, setHomeState] = useState('description');
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

  // useEffect(() => {
  //   const getResultById = async () => {
  //     const ResultById = await window.contract.get_all_results_by_poll_criteria_id({ poll_id: pollInfo.id });
  //     console.log(ResultById);

  //   };
  //   getResultById();
  // }, [pollInfo.id, checkUserVoted]);

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
  }, [userInfo.id, pollInfo, checkUserVoted, page]);

  useEffect(() => {
    const getTotalVote = async () => {
      const total_user_voted = await window.contract.num_users_vote_for_a_poll({ poll_id: pollInfo.id });
      setTotalVote(total_user_voted);
    };
    getTotalVote();
  }, [checkUserVoted]);

  const [arrayCriteriaId, setArrayCriteriaId] = useState<number[]>([]);
  const [arrayOptionId, setArrayOptionId] = useState<number[]>([]);
  useEffect(() => {
    let newArrayCriteriaId: number[] = [];
    let newArrayOptionId: number[] = [];
    if (pollInfo) {
      pollInfo.criteria_option_id_array.map((item: any) => {
        newArrayCriteriaId = [...newArrayCriteriaId, item.criteria_id];
        newArrayOptionId = [...newArrayOptionId, item.poll_option_id];
      });
      setArrayCriteriaId(newArrayCriteriaId);
      setArrayOptionId(newArrayOptionId);
    }
  }, [pollInfo]);

  return (
    <div className="mb-[3rem] flex flex-col md:flex-col relative" hidden={pollInfo.end_at < Today}>
      <Modal avatar={true} title={pollInfo.title} icon={<IoRocket className="mr-2" />}>
        {/* content vote */}

        {homeState === 'result' && checkUserVoted === true ? (
          <HomeResult criteriaIds={arrayCriteriaId} pollDescription={pollInfo.description} />
        ) : (
          <>
            {homeState === 'description' && (
              <HomeDescription
                pollDescription={pollInfo.description}
                criteriaIds={arrayCriteriaId}
                imgUrl={pollInfo.img_url}
              />
            )}
            {homeState === 'vote' && (
              <HomeVote
                pollId={pollInfo.id}
                optionIds={arrayOptionId}
                criteriaIds={arrayCriteriaId}
                arrayCriteriaOptionId={pollInfo.criteria_option_id_array}
                selected={selected}
                setSelected={setSelected}
                setCheckUserVoted={setCheckUserVoted}
                setHomeState={setHomeState}
              />
            )}
          </>
        )}

        {/* vote Footer */}
        <div className=" w-full left-0 flex absolute bottom-0 flex-col items-center">
          <div className="border-t-[1px] border-primary-60 w-5/6"></div>
          <BtnGroup css="my-3">
            <Button
              title="Description"
              upcase={false}
              active={homeState === 'description'}
              outline={false}
              idDisable={checkUserVoted === true || isMember === false}
              handle={() => {
                HandleSetHomeState('description');
              }}
            />
            {homeState === 'result' ? <div className="w-[1px] bg-primary-30 my-[3px]"></div> : <></>}
            <Button
              title={
                <div className="flex items-center">
                  <IoPizza className="mr-[4px]" /> Vote
                </div>
              }
              upcase={false}
              active={homeState === 'vote'}
              outline={false}
              idDisable={!window.walletConnection.isSignedIn() || checkUserVoted === true || isMember === false}
              handle={() => {
                HandleSetHomeState('vote');
              }}
            />
          </BtnGroup>
        </div>
      </Modal>

      {/* Extra info */}
      <div className="lg:absolute lg:-right-56 lg:top-24">
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
            <Link to={`/organization/vote-results/${pollInfo.id}`} className="flex items-center">
              <IoMegaphone className="text-[rgba(255,255,255,0.8)] text-xl mr-[6px]" />
              quick view result
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Poll;
