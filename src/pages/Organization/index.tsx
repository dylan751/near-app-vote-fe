import Avatar from '../../components/Avatar/Avatar';
import Item from '../../components/Item/Item';
import Header from '../../components/Layout/DefaultLayout/Header';
import { IoPeopleOutline, IoBeerOutline, IoAlbumsOutline } from 'react-icons/io5';
import AnswerOptions from './AnswerOptions';
import VoteResult from './VoteResult';
import Polls from './Polls';
import Members from './Members';
import { Link } from 'react-router-dom';

interface props {
  state: { orverview: boolean; members: boolean; polls: boolean; answerOptions: boolean; voteResult: boolean };
}

const Organization: React.FC<props> = ({ state }) => {
  return (
    <div className="flex flex-col pb-8">
      <Header />
      {/* Tag menu */}
      <div className="px-2 md:px-8 xl:px-56 border-b-[1px] border-primary-20 mt-20">
        <Avatar name="BTC Studio" size="big" />
        <div className="flex mt-4">
          {/* Members */}
          <Link to="/organization/members" className="mr-8 relative">
            <Item
              title="Members"
              icon={<IoPeopleOutline />}
              active={state.members}
              fontSize="md"
              line={state.members}
            />
          </Link>
          {/* List polls ans result */}
          <Link to="/organization/polls" className="mr-8 relative">
            <Item
              title="Polls"
              icon={<IoBeerOutline />}
              active={state.polls || state.voteResult}
              fontSize="md"
              line={state.polls}
            />
          </Link>
          {/* List answer options */}
          <Link to="/organization/answer-options" className="mr-8 relative">
            <Item
              title="Answer Options"
              icon={<IoAlbumsOutline />}
              active={state.answerOptions}
              fontSize="md"
              line={state.answerOptions}
            />
          </Link>
        </div>
      </div>
      {/* Content */}
      <div className="w-full sm:px-2 md:px-8 xl:px-56 mt-2">
        {state.answerOptions && <AnswerOptions />}
        {state.members && <Members />}
        {state.polls && <Polls />}
        {state.voteResult && <VoteResult />}
      </div>
    </div>
  );
};

export default Organization;
