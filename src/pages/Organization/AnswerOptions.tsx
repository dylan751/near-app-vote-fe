import AnswerCard from '../../components/AnswerCard/AnswerCard';
import { useRecoilValue } from 'recoil';
import { OptionsCall, getAllOptions, getTotalOptions } from '../../recoil/create-options/OptionsState';
import { useEffect, useState } from 'react';
import { OptionModel } from '../../Model/Poll';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';
import ReactPaginate from 'react-paginate';
import TitleWrapper from '../../components/TitleWrapper';

const LIMIT_OPTION = 6;
const AnswerOptions: React.FC = () => {
  const [total, setTotal] = useState<number>(0);
  const totalPage = Math.ceil(total / LIMIT_OPTION);
  const [optionsPage, setOptionsPage] = useState<OptionModel[]>([]);
  useEffect(() => {
    const getOptionsPage = async () => {
      const newOptionsPage = await getAllOptions(LIMIT_OPTION, 0);
      const total = await getTotalOptions();
      setTotal(total);
      setOptionsPage(newOptionsPage);
    };
    getOptionsPage();
  }, []);
  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full flex-wrap mt-4 justify-center lg:justify-start min-h-[380px]">
        {optionsPage.map((option) => {
          return (
            <TitleWrapper
              key={option.id}
              title={
                <ul>
                  {option.options?.map((item, index) => (
                    <li
                      key={index}
                      className={`text-overflow_1 py-1 ${index + 1 === option.options?.length ? '' : 'border-b-2'}`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              }
              titleStyle="w-[200px] top-16 left-[84px]"
              wrapperStyle="transition-all"
            >
              <AnswerCard
                css="lg:mr-12 mb-8 mx-2 cursor-default"
                key={option.id}
                title={option.title}
                content={option.description}
              />
            </TitleWrapper>
          );
        })}
      </div>
      {total > LIMIT_OPTION ? (
        <div className="mt-3 flex items-center">
          <ReactPaginate
            className="flex p-1 rounded-xl bg-primary-10 mt-8"
            breakLabel="..."
            nextLabel={<IoArrowForward />}
            previousLabel={<IoArrowBack />}
            pageRangeDisplayed={2}
            marginPagesDisplayed={2}
            onPageChange={async (e) => {
              const newOptionsPage = await getAllOptions(LIMIT_OPTION, e.selected * LIMIT_OPTION);
              setOptionsPage(newOptionsPage);
            }}
            pageCount={totalPage}
            activeClassName="bg-primary-30 text-primary-90"
            pageClassName="px-4 py-2 mx-1 rounded-md flex items-center hover:text-primary-90 hover:bg-primary-10"
            disabledClassName="cursor-not-allowed text-primary-20 z-50"
            previousClassName={`flex items-center px-2`}
            nextClassName={`flex items-center px-2`}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default AnswerOptions;
