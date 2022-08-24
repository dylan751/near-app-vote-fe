import { avatarIcon } from '../../assets/images';

interface props {
  name?: string;
  size: string; // big or small
  note?: string;
  css?: string;
}

const Avatar: React.FC<props> = ({ name, size, note, css }) => {
  return (
    <div className={`flex items-center ${css}`}>
      <div
        className={`${
          size === 'big' ? 'w-[75px] h-[75px] bg-white' : 'w-6 h-6'
        } rounded-full flex justify-center items-center overflow-hidden`}
      >
        <img src={avatarIcon} alt="avatar" className="w-full h-full" />
      </div>
      <div className="flex flex-col justify-center items-start">
        <h1 className={`text-white font-bold ${size === 'big' ? ' text-2xl ml-6' : 'text-sm ml-1'}`}>{name}</h1>
        {note && <p className="text-[8px] font-normal text-primary-40 ml-1">{note}</p>}
      </div>
    </div>
  );
};

export default Avatar;
