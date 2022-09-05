import { Link } from 'react-router-dom';
import AnswerCard from '../../components/AnswerCard/AnswerCard';
import { yyyymmdd } from '../../utils/HandleDate';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';
import { getAllPolls, getTotalPolls, PollsCall } from '../../recoil/create-poll/PollsState';
import ReactPaginate from 'react-paginate';
import { PollModel } from '../../Model/Poll';
import { useState, useEffect } from 'react';
const LIMIT_POLLS = 6;

const Polls: React.FC = () => {
  const [total, setTotal] = useState<number>(0);
  const totalPage = Math.ceil(total / LIMIT_POLLS);
  const [pollsPage, setPollsPage] = useState<PollModel[]>([]);
  useEffect(() => {
    const getPollsPage = async () => {
      const newPollsPage = await getAllPolls(LIMIT_POLLS, 0);
      setPollsPage(newPollsPage);
      const total = await getTotalPolls();
      setTotal(total);
    };
    getPollsPage();
  }, []);
  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full flex-wrap mt-4 justify-center lg:justify-start min-h-[380px]">
        {pollsPage.map((poll) => {
          let endDate: string;
          let expire: boolean = new Date().getTime() - (poll.end_at as number) > 0;
          endDate = yyyymmdd(new Date(poll.end_at as number));
          return (
            <Link to={`/organization/vote-results/${poll.id}`} key={poll.id}>
              <AnswerCard
                css={`
                  lg: mr-12 mb-8 mx-2
                    ${expire ? '' : 'border-2 hover:shadow-md hover:shadow-white hover:bg-primary-30 '};
                `}
                title={poll.title}
                content={''}
              >
                {expire ? (
                  <div className="absolute bottom-1 left-2 text-sm text-primary-30">Expried</div>
                ) : (
                  <div className="absolute bottom-1 left-2 text-sm text-primary-30">Available</div>
                )}
                <div className="absolute bottom-1 right-2 text-sm text-primary-30 italic">{endDate}</div>
              </AnswerCard>
            </Link>
          );
        })}
      </div>
      {total > LIMIT_POLLS ? (
        <div className="mt-3 flex items-center">
          <ReactPaginate
            className="flex p-1 rounded-xl bg-primary-10 mt-8"
            breakLabel="..."
            nextLabel={<IoArrowForward />}
            previousLabel={<IoArrowBack />}
            pageRangeDisplayed={2}
            marginPagesDisplayed={2}
            onPageChange={async (e) => {
              const newPollsPage = await getAllPolls(LIMIT_POLLS, e.selected * LIMIT_POLLS);
              setPollsPage(newPollsPage);
            }}
            pageCount={totalPage}
            pageClassName="px-4 py-2 mx-1 rounded-md flex items-center hover:text-primary-90 hover:bg-primary-10"
            previousClassName={`flex items-center px-2`}
            nextClassName={`flex items-center px-2 `}
            disabledClassName="cursor-not-allowed text-primary-20"
            activeClassName="bg-primary-30 text-primary-90"
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Polls;
