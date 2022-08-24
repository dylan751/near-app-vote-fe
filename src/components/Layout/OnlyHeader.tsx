import Header from './DefaultLayout/Header';

interface Props {
  children: JSX.Element;
}
const OnlyHeader: React.FC<Props> = ({ children }) => {
  return (
    <>
      <div className="flex items-center flex-col relative min-h-screen">
        <Header />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{children}</div>
      </div>
    </>
  );
};

export default OnlyHeader;
