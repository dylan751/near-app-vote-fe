import React, { useEffect, useState } from 'react';
import { IoTrash } from 'react-icons/io5';
import Select, { StylesConfig } from 'react-select';
import { selectedCriteriaOption } from '../../Model/Poll';
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
  setArrayCriteriaOptionId: React.Dispatch<React.SetStateAction<selectedCriteriaOption[] | undefined>>;
  order: number;
  IdValueCriteria: number;
  IdValueOption: number;
}
function CreateAnswer(props: Props) {
  const { arrayCriteriaOptionId, setArrayCriteriaOptionId, order, IdValueCriteria, IdValueOption } = props;
  const [criterias, setCriterias] = useState<Criteria[]>();
  const [options, setOPtions] = useState<optionsInterface[]>([]);
  const [arrayCriterias, setArrayCriterias] = useState<arrayOption[]>([]);
  const [arrayOPtions, setArrayOptions] = useState<arrayOption[] | undefined>([]);

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
        criterias.map((item) => {
          newArrayCriterias = [...newArrayCriterias, { value: item.id, label: item.description }];
          setArrayCriterias(newArrayCriterias);
        });
    }
    if (options) {
      let newArrayOPtion: arrayOption[] = [];
      options &&
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

  return (
    <>
      <section>
        <div className="flex justify-between items-center">
          <h3 className="mt-2 mb-1 font-bold">Criteria {order + 1}</h3>
          <div hidden={arrayCriteriaOptionId.length === 1}>
            <button
              disabled={arrayCriteriaOptionId.length === 1}
              className="w-[18px] cursor-pointer h-[18px] flex justify-center items-center p-[2px] bg-primary-20 rounded text-primary-80"
            >
              <IoTrash
                onClick={() => {
                  let newArray = [...arrayCriteriaOptionId];
                  newArray.splice(order - 1, 1);
                  setArrayCriteriaOptionId(newArray);
                }}
              />
            </button>
          </div>
        </div>
        <div>
          <h4>Choose criteria</h4>
          <Select
            options={arrayCriterias && arrayCriterias}
            styles={selectStyle}
            onChange={(e: any) => {
              setCriteriaSelected(e.value);
            }}
          />
        </div>
        <div>
          <h4>Choose Option</h4>
          <Select
            options={arrayOPtions && arrayOPtions}
            styles={selectStyle}
            onChange={(e: any) => {
              setOPtionselected(e.value);
            }}
          />
        </div>
      </section>
    </>
  );
}

export default CreateAnswer;
