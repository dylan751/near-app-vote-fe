import Modal from '../../components/Modal/Modal';
import { IoPaperPlane, IoRefresh } from 'react-icons/io5';
import BtnGroup from '../../components/BtnGroup/BtnGroup';
import Button from '../../components/Button/Button';
import Create from './Create';
import CriteriasList from './List';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Criterias } from '../../recoil/create-criterias/CriteriaStates';
import { UserInfo } from '../../recoil/users/UserInfo';
import { Link } from 'react-router-dom';
interface props {
  create: boolean;
  list: boolean;
}
const CreateCriteria: React.FC<props> = ({ create, list }) => {
  const [criterias, setCriterias] = useRecoilState(Criterias);
  const userInfo = useRecoilValue(UserInfo);

  const handleCreateCriteria = async () => {
    try {
      const newList = criterias.filter((item) => {
        return item.description !== '';
      });
      const newListString = newList.map((item) => item.description);
      if (newList.length > 0) {
        await window.contract.create_criteria({
          callbackUrl: window.origin + '/all-criterias',
          args: {
            created_by: userInfo.id,
            descriptions: newListString,
          },
          gas: '300000000000000', // attached GAS (optional)
          amount: '100000000000000000000000', // attached deposit in yoctoNEAR (optional)
        });
      }
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div>
      <Modal
        title={create ? 'Create criterias' : 'List criterias'}
        avatar={true}
        icon={<IoPaperPlane className="mt-1 mr-2"></IoPaperPlane>}
      >
        {criterias.length > 0 && create ? (
          <button
            className="w-[18px] h-[18px] flex justify-center items-center p-[2px] bg-primary-30 rounded text-white mr-2 absolute right-8 top-11"
            title="Remove all"
            onClick={() => setCriterias([])}
          >
            <IoRefresh className="" />
          </button>
        ) : (
          <></>
        )}
        {create ? <Create userId={userInfo.id as number} /> : <></>}
        {list ? <CriteriasList /> : <></>}
        {/* ------ Control ------ */}
        {criterias.length > 0 && create ? (
          <Button
            title="Create all"
            outline={true}
            upcase={true}
            active={false}
            css="absolute bottom-20 right-10"
            handle={() => {
              if (criterias.some((item) => item.description)) {
                handleCreateCriteria();
              } else {
                alert('Please enter criteria!');
              }
            }}
          />
        ) : (
          <></>
        )}

        <div className="w-full left-0 flex absolute bottom-0 flex-col items-center">
          <div className="border-t-[1px] border-primary-60 w-5/6"></div>
          <BtnGroup css="my-3">
            <Link to="/create-criterias">
              <Button title="Create" outline={false} upcase={false} group={true} active={create} />
            </Link>
            <Link to="/all-criterias">
              <Button title="List Criterias" outline={false} upcase={false} group={true} active={list} />
            </Link>
          </BtnGroup>
        </div>
      </Modal>
    </div>
  );
};

export default CreateCriteria;
