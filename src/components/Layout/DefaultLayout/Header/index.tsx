import { useEffect, useState } from 'react';
import { IoPizza, IoWallet, IoChevronDownOutline, IoListOutline, IoLogOut } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { login, logout } from '../../../../near/utils';

function Header() {
  const [showLogout, setShowLogout] = useState<boolean>(false);

  return (
    <header className="w-screen h-16 z-50 border-b-[1px] bg-primary-100 border-primary-40 flex justify-center fixed md:px-8 xl:px-56 left-0">
      <div className="h-full w-full flex items-center justify-between">
        {/* logo */}
        <Link to={'/'} className="hidden md:flex w-[102px]  items-center justify-start relative">
          <IoPizza className="text-[32px] absolute left-0" />
          <p className="text-[24px] absolute left-[26px]">ote Me</p>
        </Link>
        <div className="w-[56px] md:hidden flex justify-start">
          <IoListOutline className="w-full text-3xl" />
        </div>
        {/* login */}
        {!window.walletConnection.isSignedIn() ? (
          <div className="h-[40px] flex items-center text-base">
            <button
              onClick={login}
              className="w-[150px] h-full rounded-full font-semibold bg-primary-30 cursor-pointer text-[#0EA5E9] hover:opacity-[0.8] "
            >
              Sign In
            </button>
          </div>
        ) : (
          <div
            className={`min-w-[200px] h-[40px] py-[8px] px-[16px] text-[20px] flex items-center justify-around rounded-full bg-primary-30 cursor-pointer relative
            before:content-[''] before:block before:absolute before:w-full before:h-6 before:top-6`}
            onMouseEnter={() => {
              setShowLogout(true);
            }}
            onMouseLeave={() => {
              setShowLogout(false);
            }}
          >
            <IoWallet className="text-lg mr-[25px]" />
            <p className="mr-[17px] text-sm">{window.accountId}</p>
            <IoChevronDownOutline className="text-lg" />
            {showLogout && (
              <div
                className={`w-full absolute top-[48px] flex items-center py-2 px-4 bg-[#375363] rounded-md shadow-md 
                border-[1px] border-transparent hover:bg-[#1e3f50] hover:border-[1px] hover:border-white transition-all`}
                onClick={() => {
                  logout();
                }}
              >
                <IoLogOut className="mr-6" />
                <span className="text-base">Logout</span>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
