import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { listPolls } from '../../recoil/trending/AllPoll';
import { allCriteriaState } from '../../recoil/trending/AllCriteria';
import Poll from './Poll';
import { allUserState } from '../../recoil/trending/AllUser';

export interface PollInterface {
  id: number;
  option_id: number;
  criteria_ids: number[];
  user_id: number;
  title: string;
  description: string;
  start_at?: number;
  end_at?: number;
  created_at?: number;
  updated_at?: number;
  homeUserState?: string;
}

function Trending() {
  const [allPolls, setAllPolls] = useRecoilState(listPolls);
  const setListCriterias = useSetRecoilState(allCriteriaState);
  const setAllUser = useSetRecoilState(allUserState);

  useEffect(() => {
    const getAllPolls = async () => {
      const ListPoll = await window.contract.get_all_polls({ limit: 100 });
      if (window.accountId !== undefined) {
        setAllPolls(
          ListPoll.sort((a: any, b: any) => {
            return b.created_at - a.created_at;
          }),
        );
      }

      setAllPolls(ListPoll);
    };
    getAllPolls();
  }, []);
  useEffect(() => {
    const getAllUser = async () => {
      const ListUser = await window.contract.get_all_users({ limit: 100 });
      setAllUser(ListUser);
    };
    getAllUser();
  }, []);
  useEffect(() => {
    const getAllCriterias = async () => {
      const allCriterias = await window.contract.get_all_criterias({ limit: 100 });
      setListCriterias(allCriterias);
    };
    getAllCriterias();
  }, []);

  return (
    <div className="min-w-[669px] min-h-[754px]  ">
      {allPolls.length !== 0 ? (
        allPolls?.map((pollInfo: any, index) => <Poll key={index} pollInfo={pollInfo} />)
      ) : (
        <p className="text-center"> Poll is empty</p>
      )}
    </div>
  );
}

export default Trending;
