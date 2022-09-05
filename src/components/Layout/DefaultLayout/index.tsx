import Header from './Header';
import Sidebar from './Sidebar';

interface Props {
  children: JSX.Element;
}
function DefaultLayout({ children }: Props) {
  return (
    <div className="flex w-full  items-center flex-col relative md:px-8 xl:px-56">
      <Header />
      <div className="w-full flex pb-8 mt-20 pt-4">
        <Sidebar />
        <div className="w-full flex justify-center">
          <div className="">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default DefaultLayout;
