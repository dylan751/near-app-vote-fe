import { OptionModel } from '../../Model/Poll';
import { Item } from '../CreateCriteria/List';
import { getNameUser } from '../../utils/GetUser';
import { ListUsers } from '../../recoil/users/UserInfo';
import { useRecoilValue } from 'recoil';
interface propsList {
  data: OptionModel[];
}

const List: React.FC<propsList> = ({ data }) => {
  const listUsers = useRecoilValue(ListUsers);

  return (
    <div className="mt-4 max-h-[480px]	overflow-auto">
      {data &&
        data.map((item, index) => {
          let listUsersOptions: string[] = item.user_ids?.map((userId) => getNameUser(userId, listUsers)) as string[];
          return (
            <div key={index} title={listUsersOptions.join(', ')} className="hover:bg-primary-20 hover:rounded-xl">
              <Item order={item.created_by} id={index + 1} description={item.description as string} css="h-16" />
            </div>
          );
        })}
    </div>
  );
};
export default List;
