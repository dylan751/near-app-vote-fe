import Header from './Header';
import Sidebar from './Sidebar';

interface Props {
  children: JSX.Element;
}
function DefaultLayout({ children }: Props) {
  return (
    <div className="flex items-center flex-col relative">
      <Header />
      <div className="w-[1085px] flex pb-8 mt-20 pt-4">
        <Sidebar />
        <div className=" flex justify-center ml-[18rem] my-auto ">
          <div className="">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default DefaultLayout;
