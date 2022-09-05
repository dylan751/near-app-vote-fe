import { avatarIcon } from '../../assets/images/index';

interface props {
  title: string | undefined;
  content: string | undefined;
  handle?: any;
  css?: string;
  note?: string | undefined | number;
  children?: JSX.Element | JSX.Element[];
}

const AnswerCard: React.FC<props> = ({ title, content, handle, css, note, children }) => {
  return (
    <div
      className={`w-[300px] h-[126px] bg-primary-20 rounded-lg p-3 flex relative cursor-pointer shadow-md ${css}`}
      onClick={handle}
    >
      <div className="h-12 w-12 rounded-3xl bg-transparent mr-4">
        <img src={avatarIcon} alt="icon" className="w-full h-full" />
      </div>
      <div>
        <h2 className="text-overflow_2 text-white text-base font-bold">{title}</h2>
        <div className="text-overflow_3 text-primary-40 text-sm font-normal ">
          {content && content.split('\n').map((i, key) => <div key={key}>{i}</div>)}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default AnswerCard;
