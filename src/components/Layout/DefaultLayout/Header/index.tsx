import { IoPizza, IoWallet, IoChevronDownOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { login, logout } from '../../../../near/utils';

function Header() {
  return (
    <header className="w-[100%] h-[64px] z-50 border-b-[1px] bg-[#05293c] border-[rgba(255,255,255,0.4)] flex justify-center fixed  ">
      <div className="h-[100%] w-[1085px]  flex items-center justify-between">
        {/* logo */}
        <Link to={'/'} className="w-[102px] flex items-center justify-start relative">
          <IoPizza className="text-[32px] absolute left-0" />
          <p className="text-[24px] absolute left-[26px]">ote Me</p>
        </Link>
        {/* login */}
        {!window.walletConnection.isSignedIn() ? (
          <div className="h-[40px] flex items-center text-base">
            {/* <button className="w-[150px] h-[100%] font-semibold cursor-pointer hover:opacity-[0.8] ">Sign Up</button> */}
            <button
              onClick={login}
              className="w-[150px] h-[100%] rounded-full font-semibold bg-[rgba(255,255,255,0.3)] cursor-pointer text-[#0EA5E9] hover:opacity-[0.8] "
            >
              Sign In
            </button>
          </div>
        ) : (
          <div
            className="min-w-[200px] h-[40px] py-[8px] px-[16px] text-[20px] flex items-center justify-around rounded-full bg-[rgba(255,255,255,0.3)] cursor-pointer"
            onClick={() => {
              logout();
            }}
          >
            <IoWallet className="text-lg mr-[25px]" />
            <p className="mr-[17px] text-sm">{window.accountId}</p>
            <IoChevronDownOutline className="text-lg" />
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
