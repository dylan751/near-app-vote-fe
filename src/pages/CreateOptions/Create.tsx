import { useRecoilState } from 'recoil';
import { Options } from '../../recoil/create-options/OptionsState';
import { IoClose, IoAdd } from 'react-icons/io5';
import Button from '../../components/Button/Button';
import { Fragment, useEffect, useId, useRef } from 'react';
import React from 'react';
import { useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';

interface propsOptionItem {
  order: number;
  title: string;
}
const OptionItem: React.FC<propsOptionItem> = ({ order, title }) => {
  const [answerOptions, setAnserOptions] = useRecoilState(Options);
  const { options } = answerOptions;
  let refInput = useRef<HTMLInputElement>(null);

  return (
    <div className="flex justify-between mb-4 items-center relative">
      <input
        ref={refInput}
        className="bg-transparent w-full text-base pl-2 pr-8 py-2 font-medium rounded-lg border-[1px] border-primary-30 focus:border-[1px] focus:border-white"
        value={title}
        placeholder={`Option ${order} `}
        onChange={(e) => {
          let newOptions = [...(options as string[])];
          newOptions[order - 1] = refInput.current?.value ? refInput.current?.value : '';
          setAnserOptions({ ...answerOptions, options: [...newOptions] });
        }}
        autoFocus
      />
      {(options as string[]).length > 1 && (
        <div
          className="absolute right-2 cursor-pointer"
          onClick={() => {
            let newOptions = [...(options as string[])];
            newOptions.splice(order - 1, 1);
            setAnserOptions({ ...answerOptions, options: [...newOptions] });
          }}
        >
          <IoClose className="text-xl text-primary-40" />
        </div>
      )}
    </div>
  );
};

const Create: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  const id = useId();
  const [answerOptions, setAnserOptions] = useRecoilState(Options);
  const { options } = answerOptions;
  const params = useParams();

  useEffect(() => {
    const getOption = async (optionId: number) => {
      try {
        const option = await window.contract.get_poll_option_by_id({ poll_option_id: optionId });
        setAnserOptions(option);
      } catch (error) {
        console.log('Error: ', error);
      }
    };
    if (params.option_id) {
      getOption(parseInt(params.option_id));
    }
  }, []);
  if (isLoading) {
    return (
      <div className="absolute top-1/3 left-1/2">
        <ReactLoading
          type="bubbles"
          color="#eee"
          height={'20%'}
          width={50}
          className="absolute top-1 left-1/2 -translate-x-1/2	"
        />
      </div>
    );
  }
  return (
    <Fragment>
      {/* Input title */}
      <div className="mt-4">
        <input
          placeholder="The options title"
          className="h-10 w-full bg-primary-20 rounded-lg py-2 px-3 outline-none border-[2px] border-transparent focus:border-[2px] focus:border-white"
          onChange={(e) => {
            setAnserOptions({ ...answerOptions, title: e.target.value ? e.target.value : '' });
          }}
          value={answerOptions.title}
        />
      </div>
      {/* Answer options */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="">Answer options</h3>
        </div>
        <div className="list-criterias w-full h-64 py-3 rounded-lg overflow-y-auto">
          {options?.map((option, index) => {
            return <OptionItem key={id + index} order={index + 1} title={option} />;
          })}
          <Button
            upcase={false}
            active={false}
            title={
              <div
                className="flex items-center"
                onClick={() => {
                  setAnserOptions({ ...answerOptions, options: [...(options as string[]), ''] });
                }}
              >
                <IoAdd className="text-xl mr-1 font-bold" />
                Add
              </div>
            }
            outline={true}
            css="px-[12px]"
          />
        </div>
      </div>
      {/* Write description */}
      <div>
        <textarea
          placeholder="Write description"
          className="w-full bg-transparent mt-8 max-h-16 overflow-hidden outline-none border-[2px] border-transparent focus:border-[2px] px-2 py-1 focus:border-white rounded-xl"
          onChange={(e) => {
            setAnserOptions({ ...answerOptions, description: e.target.value ? e.target.value : '' });
          }}
          value={answerOptions.description}
        />
      </div>
    </Fragment>
  );
};

export default Create;
