import Modal from '../../components/Modal/Modal';
import { IoPeople } from 'react-icons/io5';
import Button from '../../components/Button/Button';
import BtnGroup from '../../components/BtnGroup/BtnGroup';
import { useState } from 'react';
import Create from './Create';
import List from './List';
import { useRecoilValue } from 'recoil';
import { Option, OptionsCall } from '../../recoil/create-options/OptionsState';
import { UserInfo } from '../../recoil/users/UserInfo';
import { Link } from 'react-router-dom';
interface props {
  create: boolean;
  list: boolean;
}
const CreateOptions: React.FC<props> = ({ create, list }) => {
  // const [content, setContent] = useState<content>({ create: true, list: false });
  const option = useRecoilValue(Option);
  const optionsCall = useRecoilValue(OptionsCall);
  const user = useRecoilValue(UserInfo);
  const handleCreateOption = () => {
    const createOption = async () => {
      try {
        await window.contract.create_poll_option({
          callbackUrl: window.origin + '/all-options',
          args: {
            created_by: user.id,
            title: option.title,
            description: option.description,
            user_ids: option.user_ids,
          },
          gas: '300000000000000', // attached GAS (optional)
          amount: '100000000000000000000000', // attached deposit in yoctoNEAR (optional)
        });
      } catch (error) {
        console.log(error);
      }
    };
    if (!option.title) {
      alert('Please enter title!');
    } else if (!option.user_ids || option.user_ids.length <= 0) {
      alert('Please choose people!');
    } else if (!option.description) {
      alert('Please enter description!');
    } else {
      createOption();
    }
  };
  return (
    <div>
      <Modal title="Create options" avatar={true} icon={<IoPeople className="mt-1 mr-2"></IoPeople>}>
        {create ? <Create /> : <></>}
        {list ? <List data={optionsCall} /> : <></>}
        {create ? (
          <Button
            group={false}
            outline={true}
            title="Create"
            upcase={true}
            active={false}
            css="absolute bottom-20 right-9 "
            handle={handleCreateOption}
          />
        ) : (
          <></>
        )}
        <div className=" w-[364px] flex absolute bottom-0 py-3 border-t-[1px] border-primary-60 justify-center">
          <BtnGroup>
            <Link to="/create-options">
              <Button title="Create" outline={false} upcase={false} group={true} active={create} />
            </Link>
            <Link to="/all-options">
              <Button title="List Options" outline={false} upcase={false} group={true} active={list} />
            </Link>
          </BtnGroup>
        </div>
      </Modal>
    </div>
  );
};

export default CreateOptions;
