import { useRecoilState } from 'recoil';
import { OptionsCall, getAllOptions } from '../../recoil/create-options/OptionsState';
import { sortByCreatedDate } from '../../utils/SortData';
import ReactLoading from 'react-loading';
import { Fragment, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { ListUsers } from '../../recoil/users/UserInfo';
import { IoClose, IoPencil } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { getNameUser } from '../../utils/GetUser';
import { OptionModel } from '../../Model/Poll';

interface propsItem {
  id: number | undefined;
  order: number | undefined;
  description: string;
  css?: string;
  index?: number;
  handleDelete: Function;
}
const OptionItem: React.FC<propsItem> = ({ order, index, description, id, handleDelete }) => {
  const listUsers = useRecoilValue(ListUsers);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <div className="w-full h-14 bg-primary-20 rounded-xl relative mb-3 pl-2 pr-4 py-1">
      <Fragment>
        {!isLoading ? (
          // Option item
          <Fragment>
            <h1 className="font-medium text-base text-white flex items-center">
              #{index}. {description}
            </h1>
            <h3 className="absolute bottom-1 right-2 text-xs text-primary-30 italic">
              Create by {getNameUser(order as number, listUsers)}
            </h3>
            {/* Control item list */}
            <div className="absolute top-1 right-1 flex">
              <Link to={`/update-options/${id}`}>
                <IoPencil
                  title="Edit"
                  className="cursor-pointer text-primary-20 hover:text-white rounded-lg text-lg mr-1"
                />
              </Link>
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
    </div>
  );
};

const OptionsList: React.FC = () => {
  const [optionsCall, setOptionsCall] = useState<OptionModel[]>([]);
  useEffect(() => {
    const getOptions = async () => {
      try {
        const optionCall = await getAllOptions(1000, 0);
        setOptionsCall(sortByCreatedDate(optionCall));
      } catch (error) {
        alert('Error: ' + error);
      }
    };
    getOptions();
  }, []);
  const handleDeleteOption = async (optionId: number, setIsLoading: Function) => {
    try {
      setIsLoading(true);
      await window.contract.delete_poll_option({ poll_option_id: optionId });
      const newCriteriasCall = await getAllOptions(1000, 0);
      setOptionsCall(sortByCreatedDate(newCriteriasCall));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      alert('Cannot delete this option! This option is linked to a Poll record!');
    }
  };
  return (
    <div className="mt-4 max-h-[480px]	overflow-auto">
      {optionsCall &&
        optionsCall.map((item, index) => {
          return (
            <div key={index} title={item.options?.join(', ')} className=" hover:rounded-xl">
              <OptionItem
                order={item.created_by}
                index={index + 1}
                id={item.id}
                description={item.title as string}
                handleDelete={handleDeleteOption}
              />
            </div>
          );
        })}
    </div>
  );
};
export default OptionsList;
