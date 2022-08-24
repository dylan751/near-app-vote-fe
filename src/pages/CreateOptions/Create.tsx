import { ListUsers } from '../../recoil/users/UserInfo';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue } from 'recoil';
import { useState } from 'react';
import { Option } from '../../recoil/create-options/OptionsState';
import { IoRefresh, IoCheckmark } from 'react-icons/io5';
interface propsItemCheck {
  id: number | undefined;
  description: string;
  option: any;
  setOption: Function;
}
const ItemCheck: React.FC<propsItemCheck> = ({ id, description, option, setOption }) => {
  let check: boolean = false;
  const newId = option.user_ids.indexOf(id as number);
  if (newId >= 0) check = true;
  return (
    <div>
      <input
        type="checkbox"
        id={`options-${id}`}
        value={id}
        className="w-4 h-4 mr-2"
        onChange={() => {
          const newArrIds = [...(option.user_ids as number[])];
          if (check) newArrIds.splice(newId, 1);
          else newArrIds.push(id as number);
          setOption({ ...option, user_ids: newArrIds });
        }}
        checked={check}
      />
      <label
        htmlFor={`options-${id}`}
        className={`font-medium text-base cursor-pointer ${!check ? 'text-primary-40' : ''}`}
      >
        {description}
      </label>
    </div>
  );
};
const Create: React.FC = () => {
  const listUsers = useRecoilValue(ListUsers);
  const [option, setOption] = useRecoilState(Option);

  return (
    <div>
      {/* Input title */}
      <div className="mt-4">
        <input
          placeholder="The options title"
          className="h-10 w-full bg-primary-20 rounded-lg py-2 px-3 outline-none"
          onChange={(e) => {
            setOption({ ...option, title: e.target.value ? e.target.value : '' });
          }}
          value={option.title}
        />
      </div>
      {/* Select peoples */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="">Select people</h3>
          <div className="flex">
            <button
              className="w-[18px] h-[18px] flex justify-center items-center p-[2px] bg-primary-20 rounded text-primary-80 mr-2"
              title="Select all"
              onClick={() => {
                const newArr = listUsers.map((item) => item.id);
                setOption({ ...option, user_ids: [...newArr] as number[] });
              }}
            >
              <IoCheckmark />
            </button>
            <button
              className="w-[18px] h-[18px] flex justify-center items-center p-[2px] bg-primary-20 rounded text-primary-80 mr-2"
              title="Reset"
              onClick={() => {
                setOption({ ...option, user_ids: [] as number[] });
              }}
            >
              <IoRefresh />
            </button>
          </div>
        </div>
        <div className="w-full h-60 bg-primary-20 px-4 py-3 rounded-lg overflow-y-auto">
          {listUsers &&
            listUsers.map((user) => {
              return (
                <ItemCheck
                  key={user.id}
                  id={user.id as number}
                  description={user.name as string}
                  option={option}
                  setOption={setOption}
                />
              );
            })}
        </div>
      </div>
      {/* Write description */}
      <div>
        <textarea
          placeholder="Write description"
          className="w-full bg-transparent mt-8 max-h-16 overflow-hidden outline-none"
          onChange={(e) => {
            setOption({ ...option, description: e.target.value ? e.target.value : '' });
          }}
          value={option.description}
        />
      </div>
    </div>
  );
};

export default Create;
