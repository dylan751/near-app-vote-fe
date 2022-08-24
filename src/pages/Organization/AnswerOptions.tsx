import AnswerCard from '../../components/AnswerCard/AnswerCard';
import { useRecoilValue } from 'recoil';
import { OptionsCall } from '../../recoil/create-options/OptionsState';

const AnswerOptions: React.FC = () => {
  const options = useRecoilValue(OptionsCall);
  return (
    <div className="flex w-full flex-wrap mt-4">
      {options &&
        options.map((option) => {
          return (
            <AnswerCard
              css="mr-10 mb-6 cursor-default"
              key={option.id}
              title={option.title}
              content={option.description}
            />
          );
        })}
    </div>
  );
};

export default AnswerOptions;
