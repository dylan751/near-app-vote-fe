import Button from '../Button/Button';

interface props {
  children: JSX.Element | JSX.Element[];
  css?: string;
}

const BtnGroup: React.FC<props> = ({ children, css }) => {
  return <div className={`flex bg-primary-30 rounded-lg p-[4px] ${css}`}>{children}</div>;
};

export default BtnGroup;
