import Modal from '../../components/Modal/Modal';
import { IoPeople } from 'react-icons/io5';
import Button from '../../components/Button/Button';
import BtnGroup from '../../components/BtnGroup/BtnGroup';
import Create from './Create';
import OptionsList from './List';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { Options } from '../../recoil/create-options/OptionsState';
import { UserInfo } from '../../recoil/users/UserInfo';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface props {
  create: boolean;
  list: boolean;
  update: boolean;
}
const CreateOptions: React.FC<props> = ({ create, list, update }) => {
  const option = useRecoilValue(Options);
  const resetOptionValue = useResetRecoilState(Options);

  const user = useRecoilValue(UserInfo);
  const history = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleCreateOption = () => {
    const createOption = async () => {
      try {
        await window.contract.create_poll_option({
          callbackUrl: window.origin + '/all-options',
          args: {
            created_by: user.id,
            title: option.title,
            description: option.description,
            options: option.options,
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
    } else if ((option.options as string[]).length <= 1) {
      alert('Please enter options!');
    } else if ((option.options as string[]).some((item) => item === '')) {
      alert('Option not empty!');
    } else if (!option.description) {
      alert('Please enter description!');
    } else {
      createOption();
    }
  };
  const handleUpdateOption = async () => {
    try {
      setIsLoading(true);
      await window.contract.update_poll_option({
        callbackUrl: window.origin + '/all-options',
        args: {
          poll_option_id: option.id,
          title: option.title,
          description: option.description,
          options: option.options,
        },
      });
      setIsLoading(false);
      history('/all-options');
    } catch (error) {
      alert('Error: ' + error);
    }
  };
  useEffect(() => {
    if (window.location.pathname === '/create-options') resetOptionValue();
  }, []);
  return (
    <div>
      <Modal
        title={`${create ? 'Create option' : ''} ${update ? 'Update option' : ''} ${list ? 'List options' : ''}`}
        avatar={true}
        icon={<IoPeople className="mt-1 mr-2"></IoPeople>}
      >
        {create ? <Create isLoading={false} /> : <></>}
        {update ? <Create isLoading={isLoading} /> : <></>}
        {list ? <OptionsList /> : <></>}
        {create || update ? (
          <Button
            group={false}
            outline={true}
            title={create ? 'Create' : 'Update'}
            upcase={true}
            active={false}
            css="absolute bottom-20 right-9 "
            handle={create ? handleCreateOption : handleUpdateOption}
          />
        ) : (
          <></>
        )}
        <div className=" w-full left-0 flex absolute bottom-0 flex-col items-center">
          <div className="border-t-[1px] border-primary-60 w-5/6"></div>
          <BtnGroup css="my-3">
            <Link to="/create-options">
              <Button
                title="Create"
                outline={false}
                upcase={false}
                group={true}
                active={create}
                handle={resetOptionValue}
              />
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
