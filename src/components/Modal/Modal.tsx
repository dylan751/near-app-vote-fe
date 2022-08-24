import Avatar from '../Avatar/Avatar';

interface props {
  title?: string;
  children: JSX.Element | JSX.Element[];
  avatar?: boolean;
  icon?: JSX.Element;
}

const Modal: React.FC<props> = ({ title, children, avatar, icon }) => {
  return (
    <div>
      {avatar && <Avatar name="BTC Studio" size="big" css="mb-8" />}
      <div className="p-[34px] w-[434px] h-[648px] rounded-2xl bg-primary-20 relative">
        <div className="text-2xl font-bold text-white text-start flex ">
          {title && (
            <h1 className="flex text-start text-xl">
              {icon}
              {title}
            </h1>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
