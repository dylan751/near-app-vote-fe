import { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import ReactPaginate from 'react-paginate';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';
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
  const [pageNumber, setPageNumber] = useState(0);
  const [allPollsDisplay, setAllPollsDisplay] = useState<PollInterface[]>([]);
  //get data
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
  }, [pageNumber]);

  useEffect(() => {
    if (allPolls || pageNumber) {
      const newAllPols = allPolls.filter((poll) => {
        return (poll.end_at as number) >= new Date().getTime();
      });
      setAllPollsDisplay(newAllPols);
    }
  }, [allPolls, pageNumber]);
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

  // pagination

  const pollsPerPage = 2;
  const pollsVisited = pageNumber * pollsPerPage;
  const displayPolls = allPollsDisplay
    .slice(pollsVisited, pollsVisited + pollsPerPage)
    .map((pollitem: any) => <Poll key={pollitem.id} pollInfo={pollitem} page={pageNumber} />);

  const pageCount = Math.ceil(allPollsDisplay.length / pollsPerPage);
  const changePage = ({ selected }: any) => {
    setPageNumber(selected);
  };

  return (
    <div className="min-h-[754px]">
      {allPollsDisplay.length !== 0 ? (
        <div>
          {displayPolls}
          {allPollsDisplay.length > pollsPerPage && (
            <div className="flex items-center justify-center">
              <ReactPaginate
                className="flex p-1 rounded-xl bg-primary-10 shadow-md"
                previousLabel={<IoArrowBack />}
                nextLabel={<IoArrowForward />}
                pageCount={pageCount}
                onPageChange={changePage}
                pageClassName="px-4 py-2 mx-1 rounded-md flex items-center hover:text-primary-90 hover:bg-primary-10"
                previousClassName={`flex items-center px-2`}
                nextClassName={`flex items-center px-2 `}
                activeClassName="bg-primary-30 text-primary-90"
                disabledClassName="cursor-not-allowed text-primary-20"
              />
            </div>
          )}
        </div>
      ) : (
        <p className="text-center"> Poll is empty !</p>
      )}
    </div>
  );
}

export default Trending;
