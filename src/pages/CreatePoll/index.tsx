import Modal from '../../components/Modal/Modal';
import BtnGroup from '../../components/BtnGroup/BtnGroup';
import Button from '../../components/Button/Button';
import Description from './Description';
import Answer from './Answer';
import Setting from './Setting';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Poll, PollsCall } from '../../recoil/create-poll/PollsState';
import { nextState } from '../../utils/CreatePollHandle';
import { IoRocket } from 'react-icons/io5';
import { UserInfo } from '../../recoil/users/UserInfo';
import { useState } from 'react';
import { connectToDAO } from '../../utils/near/DAO';

const CreatePoll: React.FC = () => {
  const [switchContentState, setSwitchContentState] = useState({ description: true, answer: false, setting: false });
  const userInfo = useRecoilValue(UserInfo);
  const [poll] = useRecoilState(Poll);
  const [checkArrayOptionCriteria, setCheckArrayOptionCriteria] = useState(false);

  const [validDate, setValidDate] = useState<{ date: boolean; hours: boolean }>({ date: false, hours: false });
  const handlePostPoll = async () => {
    // await window.contract.create_poll({
    //   callbackUrl: window.origin,
    //   args: {
    //     // criteria_ids: poll.criteria_ids,
    //     // poll_option_id: poll.poll_option_id,
    //     criteria_option_id_array: poll.criteria_option_id_array,
    //     created_by: userInfo.id,
    //     title: poll.title,
    //     img_url: poll.img_url,
    //     description: poll.description,
    //     start_at: new Date().getTime(),
    //     end_at: poll.end_at,
    //   },
    //   gas: '300000000000000', // attached GAS (optional)
    //   amount: '100000000000000000000000', // attached deposit in yoctoNEAR (optional)
    // });

    /**
     * Batch transactions
     * 1. Connect to our Smart Contract
     * 2. Connect to DAO Smart Contract
     */

    await connectToDAO(
      poll.criteria_option_id_array,
      userInfo.id,
      poll.title,
      poll.img_url,
      poll.description,
      poll.start_at,
      poll.end_at,
    );
  };

  return (
    <div>
      <Modal
        avatar={true}
        title={switchContentState.description === true ? '' : poll.title}
        icon={<IoRocket className="mt-1 mr-2"></IoRocket>}
      >
        {switchContentState.description ? <Description /> : <></>}
        {switchContentState.answer ? <Answer setCheckArrayOptionCriteria={setCheckArrayOptionCriteria} /> : <></>}
        {switchContentState.setting ? <Setting validDate={validDate} setValidDate={setValidDate} /> : <></>}
        <div className=" w-full left-0 flex absolute bottom-0 flex-col items-center">
          <div className="border-t-[1px] border-primary-60 w-5/6"></div>
          <div className="flex justify-between w-5/6">
            <BtnGroup css="my-3">
              <Button
                title="Description"
                active={switchContentState.description}
                outline={false}
                upcase={false}
                group={true}
                handle={() => {
                  setSwitchContentState({
                    description: true,
                    answer: false,
                    setting: false,
                  });
                }}
              />
              <Button
                title="Answer"
                active={switchContentState.answer}
                outline={false}
                upcase={false}
                group={true}
                idDisable={!poll.title || !poll.description || !poll.img_url}
                handle={() => {
                  setSwitchContentState({
                    description: false,
                    answer: true,
                    setting: false,
                  });
                }}
              />
              <Button
                title="Setting"
                active={switchContentState.setting}
                outline={false}
                upcase={false}
                group={true}
                idDisable={
                  !poll.title ||
                  !poll.description ||
                  poll.criteria_option_id_array?.length === 0 ||
                  checkArrayOptionCriteria === false
                }
                handle={() => {
                  setSwitchContentState({
                    description: false,
                    answer: false,
                    setting: true,
                  });
                }}
              />
            </BtnGroup>
            <Button
              title={switchContentState.setting ? 'Post' : 'Next'}
              active={false}
              outline={true}
              upcase={true}
              handle={() => {
                const newState = nextState(switchContentState);
                if (switchContentState.description && (!poll.title || !poll.description || !poll.img_url)) {
                  alert('Please enter title and description!');
                  return;
                } else if (
                  switchContentState.answer &&
                  (!poll.criteria_option_id_array || poll.criteria_option_id_array.length <= 0)
                ) {
                  alert('Please select criterias!');
                  return;
                } else if (switchContentState.setting && (!validDate.date || !validDate.hours)) {
                  if (!validDate.date && !validDate.hours) {
                    alert('Please select calendar and hours!');
                  } else if (!validDate.hours) {
                    alert('Please select hours!');
                  } else if (!validDate.date) {
                    alert('Please select calendar!');
                  }
                  return;
                } else {
                  setSwitchContentState(newState);
                }
                if (switchContentState.setting) {
                  handlePostPoll();
                }
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreatePoll;
