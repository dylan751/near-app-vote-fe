import { BsStars, BsLightningChargeFill } from 'react-icons/bs';
import { IoBeer, IoIceCream, IoPeople, IoPaperPlane } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { login } from '../../../../near/utils';
import { UserInfo, IsMemberState } from '../../../../recoil/users/UserInfo';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { Options } from '../../../../recoil/create-options/OptionsState';
function Sidebar() {
  const userInfo = useRecoilValue(UserInfo);
  const isMember = useRecoilValue(IsMemberState);
  const resetOptionValue = useResetRecoilState(Options);

  return (
    <div className="hidden md:block xl:w-48 min-h-[200px] fixed ">
      <>
        <Link
          to={'/'}
          className={`flex items-center mb-[20px] font-bold text-base ${
            window.location.pathname === '/' ? 'text-[#fff]' : 'text-[rgba(255,255,255,0.6)]'
          }`}
        >
          <BsStars className="mr-[8px] text-2xl" /> Trending
        </Link>
        {userInfo.role === 'Admin' && (
          <>
            <Link
              to={'/create-poll'}
              className={`flex items-center mb-[20px] font-bold text-base ${
                window.location.pathname === '/create-poll' ? 'text-[#fff]' : 'text-[rgba(255,255,255,0.6)]'
              }`}
            >
              <IoBeer className="mr-[8px] text-2xl" /> Create a poll
            </Link>
            <Link
              to={'/create-criterias'}
              className={`flex items-center mb-[20px] font-bold text-base ${
                window.location.pathname === '/create-criterias' || window.location.pathname === '/all-criterias'
                  ? 'text-[#fff]'
                  : 'text-[rgba(255,255,255,0.6)]'
              }`}
            >
              <IoPaperPlane className="mr-[8px] text-2xl" /> Create criterias
            </Link>
            <Link
              to={'/create-options'}
              className={`flex items-center mb-[20px] font-bold text-base ${
                window.location.pathname === '/create-options' || window.location.pathname === '/all-options'
                  ? 'text-[#fff]'
                  : 'text-[rgba(255,255,255,0.6)]'
              }`}
              onClick={() => {
                resetOptionValue();
              }}
            >
              <IoPeople className="mr-[8px] text-2xl" /> Create options
            </Link>
          </>
        )}
      </>
      {!window.walletConnection.isSignedIn() && (
        <>
          <hr className="w-[80%] my-[32px] border-[rgba(255,255,255,0.4)] " />
          <button
            className="min-w-[120px] h-[30px] px-[17px] border-[1px] border-[#0EA5E9] text-[14px] text-[#0EA5E9] flex items-center justify-center rounded-md hover:opacity-[0.8]"
            onClick={login}
          >
            <BsLightningChargeFill className="mr-[6px]" /> Become User
          </button>
          <p className="text-[10px] text-[rgba(255,255,255,0.6)] my-[8px]">It’s Free Now</p>
        </>
      )}
      {isMember && (
        <Link
          to={'/organization/members'}
          className={`flex items-center mb-[20px] font-bold text-base ${
            window.location.pathname === '/organization/member' ? 'text-[#fff]' : 'text-[rgba(255,255,255,0.6)]'
          }`}
        >
          <IoIceCream className="mr-[8px] text-2xl" />
          Organization
        </Link>
      )}
    </div>
  );
}

export default Sidebar;
