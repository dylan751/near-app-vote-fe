import { useRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { IoRocket } from 'react-icons/io5';
import Modal from '../../components/Modal/Modal';
import BtnGroup from '../../components/BtnGroup/BtnGroup';
import Button from '../../components/Button/Button';
import Description from './Description';
import Answer from './Answer';
import Setting from './Setting';
import { Poll } from '../../recoil/create-poll/PollsState';
import { nextState, nextStateUpdatePoll } from '../../utils/CreatePollHandle';
import { PollUpdateState } from '../../recoil/update-poll/UpdatePolls';
import Loading from '../../components/Loading';

const UpdatePoll: React.FC = () => {
  const [switchContentState, setSwitchContentState] = useState({ description: true, setting: false });
  const [poll] = useRecoilState(Poll);
  const [validDate, setValidDate] = useState<{ date: boolean; hours: boolean }>({ date: false, hours: false });
  let { id } = useParams();
  const PollId = parseInt(id as string);
  const [checkArrayOptionCriteria, setCheckArrayOptionCriteria] = useState(false);
  const [pollNeedUpdate, setPollNeedUpdate] = useRecoilState(PollUpdateState);
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getPollById = async () => {
      if (PollId) {
        const pollById = await window.contract.get_poll_by_id({ poll_id: PollId });
        setPollNeedUpdate(pollById);
      }
    };
    getPollById();
  }, [PollId]);

  const handleUpdatePoll = async () => {
    try {
      setLoading(true);

      await window.contract.update_poll({
        callbackUrl: window.origin,
        args: {
          poll_id: pollNeedUpdate.id,
          // criteria_option_id_array: pollNeedUpdate.criteria_option_id_array,
          img_url: pollNeedUpdate.img_url,
          title: pollNeedUpdate.title,
          description: pollNeedUpdate.description,
          update_at: new Date().getTime(),
          end_at: pollNeedUpdate.end_at,
        },
      });
      setLoading(false);
      navigate('/organization/polls');
    } catch (error) {
      setLoading(false);
      alert(error);
    }
  };

  return (
    <>
      <div>
        <Modal
          avatar={true}
          title={switchContentState.description === true ? '' : poll.title}
          icon={<IoRocket className="mt-1 mr-2"></IoRocket>}
        >
          {switchContentState.description ? <Description /> : <></>}
          {switchContentState.setting ? <Setting validDate={validDate} setValidDate={setValidDate} /> : <></>}
          <div className=" w-[364px] flex absolute bottom-0 py-3 justify-between border-t-[1px] border-primary-60">
            <div className="flex justify-center flex-1">
              <BtnGroup>
                <Button
                  title="Description"
                  active={switchContentState.description}
                  outline={false}
                  upcase={false}
                  group={true}
                  handle={() => {
                    setSwitchContentState({
                      description: true,
                      setting: false,
                    });
                  }}
                />
                {/* <Button
                title="Answer"
                active={switchContentState.answer}
                outline={false}
                upcase={false}
                group={true}
                idDisable={!pollNeedUpdate.title || !pollNeedUpdate.description || !pollNeedUpdate.img_url}
                handle={() => {
                  setSwitchContentState({
                    description: false,
                    answer: true,
                    setting: false,
                  });
                }}
              /> */}
                <Button
                  title="Setting"
                  active={switchContentState.setting}
                  outline={false}
                  upcase={false}
                  group={true}
                  idDisable={!pollNeedUpdate.title || !pollNeedUpdate.description}
                  handle={() => {
                    setSwitchContentState({
                      description: false,
                      setting: true,
                    });
                  }}
                />
              </BtnGroup>
            </div>

            <Button
              title={switchContentState.setting ? 'Update' : 'Next'}
              active={false}
              outline={true}
              upcase={true}
              handle={() => {
                const newState = nextStateUpdatePoll(switchContentState);
                if (
                  switchContentState.description &&
                  (!pollNeedUpdate.title || !pollNeedUpdate.description || !pollNeedUpdate.img_url)
                ) {
                  alert('Please enter title and description!');
                  return;
                } else {
                  setSwitchContentState(newState);
                }
                if (switchContentState.setting) {
                  window.confirm('Bạn có muốn thay đổi ? ') && handleUpdatePoll();
                }
              }}
            />
          </div>
        </Modal>
        {loading && <Loading />}
      </div>
    </>
  );
};

export default UpdatePoll;
