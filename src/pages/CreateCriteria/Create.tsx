import { CriteriaModel } from '../../Model/Poll';
import { useRecoilState } from 'recoil';
import { Criterias } from '../../recoil/create-criterias/CriteriaStates';
import { useRef } from 'react';
import { IoCheckmark, IoTrash, IoAdd } from 'react-icons/io5';

interface propsCriteriaItem {
  title: string;
  order: number;
  userId: number;
}
const CriteriaItem: React.FC<propsCriteriaItem> = ({ title, order, userId }) => {
  const [criterias, setCriterias] = useRecoilState(Criterias);
  let refInput = useRef<HTMLInputElement>(null);

  const handleCreateCriteria = async (title: string) => {
    try {
      await window.contract.create_criteria({
        callbackUrl: window.origin + '/all-criterias',
        args: {
          created_by: userId,
          descriptions: [title],
        },
        gas: '300000000000000', // attached GAS (optional)
        amount: '100000000000000000000000', // attached deposit in yoctoNEAR (optional)
      });
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="flex justify-between mb-4 items-center pr-1">
      <label className={`text-base font-bold ${title ? 'pr-2' : ''}`}>{title !== '' ? `#${order}` : ''} </label>
      <input
        ref={refInput}
        className="bg-transparent w-full text-base font-bold mr-2"
        placeholder={`Criteria ${order}`}
        value={title}
        onChange={() => {
          let newCriterias: CriteriaModel[] = [];
          criterias.forEach((device, index) => {
            newCriterias[index] = { ...device };
          });
          newCriterias[order - 1].description = refInput.current?.value ? refInput.current?.value : '';
          setCriterias(newCriterias);
        }}
        autoFocus
      />
      <button className="w-[18px] h-[18px] flex justify-center items-center p-[2px] bg-greenL rounded text-white mr-2">
        <IoCheckmark
          onClick={() => {
            if (title) {
              handleCreateCriteria(title);
            } else {
              alert('Please enter criteria!');
            }
          }}
        />
      </button>
      <button className="w-[18px] h-[18px] flex justify-center items-center p-[2px] bg-primary-20 rounded text-primary-80">
        <IoTrash
          onClick={() => {
            let newCriterias = [...criterias];
            newCriterias.splice(order - 1, 1);
            setCriterias(newCriterias);
          }}
        />
      </button>
    </div>
  );
};
const Create: React.FC<{ userId: number }> = ({ userId }) => {
  const [criterias, setCriterias] = useRecoilState(Criterias);
  const handleAddPoll = () => {
    setCriterias([...criterias, { description: '' }]);
  };
  return (
    <div>
      <div className="mt-8 max-h-[340px] overflow-y-auto ">
        {criterias.map((item, index) => {
          return <CriteriaItem title={item.description} key={index} order={index + 1} userId={userId} />;
        })}
      </div>
      <button
        className="w-full h-12 mt-4 flex justify-center items-center border-[1px] border-primary-80 border-dashed rounded-xl text-primary-80"
        onClick={handleAddPoll}
      >
        <IoAdd className="mr-4 h-6 w-6" />
        Add an criteria
      </button>
    </div>
  );
};

export default Create;
