import { CriteriaModel } from '../../Model/Poll';
import { getNameUser } from '../../utils/GetUser';
import { ListUsers } from '../../recoil/users/UserInfo';
import { useRecoilValue } from 'recoil';
interface propsItem {
  id: number | undefined;
  order: number | undefined;
  description: string;
  css?: string;
}
interface propsList {
  data: CriteriaModel[] | [];
}
export const Item: React.FC<propsItem> = ({ order, id, description, css }) => {
  const listUsers = useRecoilValue(ListUsers);
  return (
    <div
      className={`w-full0 h-14 bg-primary-30 rounded-xl pl-2 pr-4 py-2 relative mb-3 cursor-pointer hover:bg-primary-30 ${css}`}
    >
      <h1 className="font-medium text-base text-white flex items-center">
        #{id}. {description}
      </h1>
      <h3 className="absolute bottom-1 right-2 text-xs text-primary-30 italic">
        Create by {getNameUser(order as number, listUsers)}
      </h3>
    </div>
  );
};

const List: React.FC<propsList> = ({ data }) => {
  return (
    <div className="list-criterias mt-4 max-h-[480px] overflow-auto">
      {data &&
        data.map((item, index) => (
          <Item key={item.id} order={item.created_by} id={index + 1} description={item.description} />
        ))}
    </div>
  );
};

export default List;
