import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import AnswerCard from '../../components/AnswerCard/AnswerCard';
import BtnGroup from '../../components/BtnGroup/BtnGroup';
import Button from '../../components/Button/Button';
import { PollsCall } from '../../recoil/create-poll/PollsState';
import { yyyymmdd } from '../../utils/HandleDate';

const Polls: React.FC = () => {
  const polls = useRecoilValue(PollsCall);

  return (
    <div>
      <div className="flex w-full flex-wrap mt-4 justify-item-start">
        {polls &&
          polls.map((poll) => {
            let endDate: string;
            let expire: boolean = false;
            if ((new Date(poll.end_at as number).getFullYear() as number) > 1970) {
              endDate = yyyymmdd(new Date(poll.end_at as number));
              if (new Date().getTime() - (poll.end_at as number) < 0) {
                expire = false;
              } else {
                expire = true;
              }
            } else endDate = '';
            return (
              <Link to={`/organization/vote-results/${poll.id}`} key={poll.id}>
                <AnswerCard
                  css={`mr-10 mb-6 ${expire ? '' : 'border-2	 hover:shadow-md hover:shadow-white hover:bg-primary-30 '}`}
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
    </div>
  );
};

export default Polls;
