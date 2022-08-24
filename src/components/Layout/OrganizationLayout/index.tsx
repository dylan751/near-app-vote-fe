interface Props {
  children: JSX.Element;
}
function DefaultLayout({ children }: Props) {
  return (
    <div className="flex items-center flex-col">
      <div className="w-[1085px] flex relavtive pb-8">
        <div className=" flex justify-center ml-36 ">
          <div className="">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default DefaultLayout;
