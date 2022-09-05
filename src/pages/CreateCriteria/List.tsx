import { getNameUser } from '../../utils/GetUser';
import { ListUsers } from '../../recoil/users/UserInfo';
import { useRecoilValue } from 'recoil';
import { IoClose, IoPencil, IoCheckmark } from 'react-icons/io5';
import { getAllCriterias } from '../../recoil/create-criterias/CriteriaStates';
import ReactLoading from 'react-loading';
import { Fragment, useEffect, useRef, useState } from 'react';
import { sortByCreatedDate } from '../../utils/SortData';
import { CriteriaModel } from '../../Model/Poll';

interface propsItem {
  id: number | undefined;
  order: number | undefined;
  description: string;
  css?: string;
  index?: number;
  handleDelete: Function;
  handleUpdate: Function;
}

const CriteriaItem: React.FC<propsItem> = ({ order, index, description, id, handleDelete, handleUpdate }) => {
  const listUsers = useRecoilValue(ListUsers);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showInputUpdate, setShowInputUpdate] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [desUpdate, setDesUpdate] = useState<String>(description);
  return (
    <div
      className={`w-full h-14 bg-primary-20 rounded-xl pl-2 pr-4 py-2 relative mb-3 
    ${showInputUpdate ? 'pl-0 pr-0 py-0' : ''}`}
    >
      {showInputUpdate ? (
        // Show input edit
        <Fragment>
          {!isLoading ? (
            <div className="relative h-full">
              <input
                ref={inputRef}
                value={desUpdate as string}
                className="h-full w-full bg-white rounded-xl py-2 pl-6 pr-8 outline-none border-[2px] border-transparent focus:border-[2px] focus:border-white text-primary-100"
                onChange={(e) => {
                  setDesUpdate(e.target.value);
                }}
                autoFocus
              />
              {/* Button control edit and update input */}
              <div
                className={`absolute top-4 right-2 p-[3px]  test-white rounded-xl cursor-pointer 
                ${
                  desUpdate.trim() === description || desUpdate === ''
                    ? 'bg-primary-100 hover:bg-opacity-80'
                    : 'bg-greenL hover:bg-opacity-80'
                }`}
              >
                {desUpdate.trim() === description || desUpdate === '' ? (
                  <IoClose
                    className=""
                    onClick={() => {
                      setDesUpdate(description);
                      setShowInputUpdate(false);
                    }}
                  />
                ) : (
                  <IoCheckmark
                    onClick={() => {
                      handleUpdate(id, desUpdate, setIsLoading);
                      setShowInputUpdate(false);
                    }}
                  />
                )}
              </div>
            </div>
          ) : (
            <ReactLoading
              type="bubbles"
              color="#eee"
              height={'20%'}
              width={50}
              className="absolute top-1 left-1/2 -translate-x-1/2	"
            />
          )}
        </Fragment>
      ) : (
        <Fragment>
          {!isLoading ? (
            // Item options
            <Fragment>
              <h1 className="font-medium text-base text-white flex items-center">
                #{index}. {description}
              </h1>
              <h3 className="absolute bottom-1 right-2 text-xs text-primary-30 italic">
                Create by {getNameUser(order as number, listUsers)}
              </h3>
              {/* Control item list */}
              <div className="absolute top-1 right-1 flex">
                <IoPencil
                  title="Edit"
                  className="cursor-pointer text-primary-20 hover:text-white rounded-lg text-lg mr-1"
                  onClick={() => {
                    setShowInputUpdate(true);
                    inputRef.current?.focus();
                  }}
                />
                <IoClose
                  className={`cursor-pointer text-primary-20 hover:bg-primary-20 hover:text-white 
                  hover:rotate-180 rounded-lg text-lg transition duration-150`}
                  title="Delete"
                  onClick={() => {
                    if (window.confirm('Bạn đã chắc chắn muốn xóa ?')) handleDelete(id as number, setIsLoading);
                  }}
                />
              </div>
            </Fragment>
          ) : (
            <ReactLoading
              type="bubbles"
              color="#eee"
              height={'20%'}
              width={50}
              className="absolute top-1 left-1/2 -translate-x-1/2	"
            />
          )}
        </Fragment>
      )}
    </div>
  );
};

const CriteriasList: React.FC = () => {
  const [criterias, setCriterias] = useState<CriteriaModel[]>([]);
  // Re-render lai moi khi thuc hien thao tac update, delete
  const [changeState, setChangeState] = useState<Boolean>(false);
  const handleDeleteCriteria = async (criteriaId: number, setIsLoading: Function) => {
    try {
      setIsLoading(true);
      await window.contract.delete_criteria({
        args: {
          criteria_id: criteriaId,
        },
      });
      setIsLoading(false);
      setChangeState(true);
    } catch (error) {
      setIsLoading(false);
      alert('Cannot delete this criteria! This criteria is linked to a Poll record!');
    }
  };
  const handleUpdateCriteria = async (criteriaId: number, newDes: string, setIsLoading: Function) => {
    try {
      setIsLoading(true);
      await window.contract.update_criteria({
        // args: {
        criteria_id: criteriaId,
        description: newDes,
        // },
      });
      setIsLoading(false);
      setChangeState(true);
    } catch (error) {
      setIsLoading(false);

      alert(error);
    }
  };
  useEffect(() => {
    const getCriterias = async () => {
      try {
        const criteriasCall = await getAllCriterias(1000, 0);
        setCriterias(sortByCreatedDate(criteriasCall));
      } catch (error) {
        alert('Error: ' + error);
      }
    };
    getCriterias();
  }, [changeState]);
  return (
    <div className="list-criterias mt-4 max-h-[480px] overflow-auto">
      {criterias &&
        criterias.map((item, index) => (
          <CriteriaItem
            key={item.id}
            id={item.id}
            order={item.created_by}
            index={index + 1}
            description={item.description}
            handleDelete={handleDeleteCriteria}
            handleUpdate={handleUpdateCriteria}
          />
        ))}
    </div>
  );
};

export default CriteriasList;
