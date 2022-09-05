import React, { useEffect, useState } from 'react';
import { IoTrash } from 'react-icons/io5';
import Select, { StylesConfig } from 'react-select';
import { useRecoilValue } from 'recoil';
import { selectedCriteriaOption } from '../../Model/Poll';
import { Poll } from '../../recoil/create-poll/PollsState';
import { Criteria } from '../Trending/TrendingStates/HomeDescription';
interface arrayOption {
  value: number;
  label: string;
}
interface optionsInterface {
  id: number;
  title: string;
  option: string[];
}

interface Props {
  arrayCriteriaOptionId: selectedCriteriaOption[];
  setArrayCriteriaOptionId: React.Dispatch<React.SetStateAction<selectedCriteriaOption[]>>;
  order: number;
  index: number;
  criteria_id: number | undefined;
  option_id: number | undefined;
}
function CreateAnswer(props: Props) {
  const { arrayCriteriaOptionId, setArrayCriteriaOptionId, order, index, criteria_id, option_id } = props;
  const [criterias, setCriterias] = useState<Criteria[]>();
  const [options, setOPtions] = useState<optionsInterface[]>([]);
  const [arrayCriterias, setArrayCriterias] = useState<arrayOption[]>([]);
  const [arrayOPtions, setArrayOptions] = useState<arrayOption[]>([]);
  const [textCriteria, setTextCriteria] = useState<string>();
  const poll = useRecoilValue(Poll);

  //get Data
  useEffect(() => {
    const getAllCriterias = async () => {
      const allCriterias = await window.contract.get_all_criterias({ limit: 100 });
      setCriterias(allCriterias);
    };
    getAllCriterias();
    const getAllOptions = async () => {
      const allOPtions = await window.contract.get_all_poll_options({ limit: 100 });
      setOPtions(allOPtions);
    };
    getAllOptions();
  }, []);
  useEffect(() => {
    if (criterias) {
      let newArrayCriterias: arrayOption[] = [];
      criterias &&
        // eslint-disable-next-line array-callback-return
        criterias.map((item) => {
          newArrayCriterias = [...newArrayCriterias, { value: item.id, label: item.description }];
          setArrayCriterias(newArrayCriterias);
        });
    }
    if (options) {
      let newArrayOPtion: arrayOption[] = [];
      options &&
        // eslint-disable-next-line array-callback-return
        options.map((item) => {
          newArrayOPtion = [...newArrayOPtion, { value: item.id, label: item.title }];
          setArrayOptions(newArrayOPtion);
        });
    }
  }, [criterias, options]);
  // style react select
  const selectStyle: StylesConfig = {
    control: (styles) => ({ ...styles, backgroundColor: 'rgba(255,255,255,0.2) ', color: '#fff' }),
    menu: (styles) => ({
      ...styles,
      backgroundColor: 'rgba(255,255,255) ',
      color: '#000',
      zIndex: '10000',
      scrollBehavior: 'smooth',
    }),
    input: (styles) => ({ ...styles, color: '#fff' }),
    placeholder: (styles) => ({ ...styles, color: '#ccc' }),
    singleValue: (styles) => ({ ...styles, color: '#fff' }),
  };
  //handle
  const [criteriaSelected, setCriteriaSelected] = useState<number>();
  const [optionSelected, setOPtionselected] = useState<number>();

  useEffect(() => {
    let newArray: selectedCriteriaOption[] = [...arrayCriteriaOptionId];
    let newArrayCriteriaOptionId = {
      criteria_id: criteriaSelected,
      poll_option_id: optionSelected,
    };
    if (arrayCriteriaOptionId.length === 1 && criteriaSelected !== undefined && optionSelected !== undefined) {
      newArray.splice(order, 1, newArrayCriteriaOptionId);
      setArrayCriteriaOptionId(newArray);
    } else {
      newArray[order] = newArrayCriteriaOptionId;
      setArrayCriteriaOptionId(newArray);
    }
  }, [criteriaSelected, optionSelected]);

  useEffect(() => {
    const findValueSelected = (id: number, array: arrayOption[]) => {
      const value = array.find((item) => item.value === id);
      return value?.label;
    };
    setTextCriteria(findValueSelected(criteriaSelected as number, arrayCriterias));
  }, [criteriaSelected]);

  const findOptionCriteriaById = (id: number, array: arrayOption[]) => {
    const value = array.find((item) => item.value === id);
    return value;
  };

  const handleDeleteCriteriaOption = (order: number) => {
    let newArray = [...arrayCriteriaOptionId];
    newArray.splice(order, 1);
    setArrayCriteriaOptionId(newArray);
  };

  let titleCriteria = findOptionCriteriaById(criteria_id as number, arrayCriterias);
  return (
    <>
      <div className="mb-2">
        <div className="flex justify-between items-center">
          <h3 className="mt-2 mb-1 font-bold">{criteria_id ? titleCriteria?.label : 'criteria' + (index + 1)}</h3>
          <div hidden={arrayCriteriaOptionId.length === 1}>
            <button
              disabled={arrayCriteriaOptionId.length === 1}
              className="w-[18px] cursor-pointer h-[18px] flex justify-center items-center p-[2px] bg-primary-20 rounded text-primary-80"
            >
              <IoTrash onClick={() => handleDeleteCriteriaOption(order)} />
            </button>
          </div>
        </div>
        <div className="mb-2">
          <h4>Choose criteria</h4>
          <Select
            options={arrayCriterias && arrayCriterias}
            styles={selectStyle}
            onChange={(e: any) => {
              setCriteriaSelected(e.value);
            }}
            value={findOptionCriteriaById(criteria_id as number, arrayCriterias) || null}
            menuShouldScrollIntoView={true}
            maxMenuHeight={150}
          />
        </div>
        <div>
          <h4>Choose Option</h4>
          <Select
            options={arrayOPtions && arrayOPtions}
            tabSelectsValue={true}
            styles={selectStyle}
            onChange={(e: any) => {
              setOPtionselected(e.value);
            }}
            value={findOptionCriteriaById(option_id as number, arrayOPtions) || null}
            menuShouldScrollIntoView={true}
            maxMenuHeight={150}
          />
        </div>
      </div>
    </>
  );
}

export default CreateAnswer;
