import { useRecoilValue } from 'recoil';
import ReactPaginate from 'react-paginate';
import { IoArrowBack, IoArrowForward, IoPencilOutline } from 'react-icons/io5';
import { AiFillDelete } from 'react-icons/ai';
import { useEffect, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import Button from '../../components/Button/Button';
import { UserInfo, ListUsers } from '../../recoil/users/UserInfo';
import { validateEmail, validateNearAddress, validateUserName } from '../../utils/ValidInput';
import { findUserById } from '../../utils/GetUser';
import { UserInfoModel } from '../../Model/User';
import Loading from '../../components/Loading';

interface inValidItemModel {
  state: boolean;
  message: string | null;
}
const Members: React.FC = () => {
  const userInfo = useRecoilValue(UserInfo);
  const listUsers = useRecoilValue(ListUsers);
  const walletInput = useRef<HTMLInputElement>(null);
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [invalidUserName, setInvalidUserName] = useState<inValidItemModel>({
    state: true,
    message: null,
  });
  const [invalidMail, setInvalidMail] = useState<inValidItemModel>({
    state: true,
    message: null,
  });
  const [invalidNear, setInvalidNear] = useState<inValidItemModel>({
    state: true,
    message: null,
  });
  const [createAccount, setCreateAccount] = useState<boolean>(false);
  const [account, setAccount] = useState<{
    name: string | undefined;
    role: string | undefined;
    email: string | undefined;
    walletAddress: string | undefined;
  }>({
    name: undefined,
    role: 'Employee',
    email: undefined,
    walletAddress: undefined,
  });
  const [userNeedUpdate, setUserNeedUpdate] = useState<UserInfoModel | undefined>(undefined);
  console.log(userNeedUpdate);

  const [defaultWalletAddress, setDefaultWalletAddress] = useState<string>();

  //validate update field
  useEffect(() => {
    if (userNeedUpdate) {
      const user = findUserById(userNeedUpdate.id as number, listUsers);
      setDefaultWalletAddress(user?.walletAddress as string);
      // field name
      userNeedUpdate.name && setInvalidUserName(validateUserName(userNeedUpdate.name));
      //field email
      userNeedUpdate.email && setInvalidMail(validateEmail(userNeedUpdate.email));
      // field Wallet Address

      userNeedUpdate.walletAddress !== '' && setInvalidNear({ state: false, message: null });

      userNeedUpdate.walletAddress === defaultWalletAddress && setInvalidNear({ state: false, message: null });
    }
  }, [userNeedUpdate]);
  // create Account
  const handleCreateAccount = async () => {
    if (invalidUserName.state === false && invalidMail.state === false && invalidNear.state === false) {
      await window.contract.create_user({
        args: {
          name: account?.name,
          role: account?.role,
          email: account?.email,
          blockchain_type: 'Near',
          wallet_address: account?.walletAddress + '.testnet',
        },
        gas: '300000000000000', // attached GAS (optional)
        amount: '100000000000000000000000', // attached deposit in yoctoNEAR (optional)
      });
    }
  };
  // delete Account
  const handleDeleteAccount = async (id: number) => {
    try {
      setLoading(true);
      await window.contract.delete_user({ user_id: id });
      setLoading(false);
      window.location.reload();
    } catch (error) {
      alert(error);
      setLoading(false);
    }
  };

  // update Account
  const handleAccountNeedUpdate = (id: number) => {
    setCreateAccount(true);
    setUserNeedUpdate(findUserById(id, listUsers));
  };

  const handleUpdateAccount = async () => {
    if (invalidUserName.state === false && invalidMail.state === false && invalidNear.state === false) {
      try {
        setLoading(true);
        await window.contract.update_user({
          callbackUrl: window.origin + '/organization/members',
          args: {
            user_id: userNeedUpdate?.id,
            name: userNeedUpdate?.name,
            role: userNeedUpdate?.role,
            email: userNeedUpdate?.email,
            blockchain_type: 'Near',
            wallet_address: userNeedUpdate?.walletAddress,
          },
        });
        window.location.reload();
        setLoading(false);
      } catch (error) {
        setLoading(false);
        alert(error);
      }
    }
  };
  // pagination member
  const [pageNumber, setPageNumber] = useState(0);
  const membersPerPage = 10;
  const membersVisited = pageNumber * membersPerPage;
  const displaymembers = listUsers.slice(membersVisited, membersVisited + membersPerPage).map((item, index) => {
    return (
      <tr key={item.id}>
        <td className="border border-slate-300 px-3 py-[6px]">{pageNumber * membersPerPage + index + 1}</td>
        <td className="border border-slate-300 px-3 py-[6px]">{item.name}</td>
        <td className="border border-slate-300 px-3 py-[6px]">{item.role}</td>
        <td className="border border-slate-300 px-3 py-[6px]">{item.email}</td>
        <td className="border border-slate-300 px-3 py-[6px]">{item.walletAddress}</td>
        {userInfo.role === 'Admin' && (
          <td className="border border-slate-300 px-3 py-[6px] flex justify-center items-center">
            <div
              className="flex justify-center px-2 py-1 cursor-pointer hover:text-slate-300 hover:bg-primary-10 rounded-lg"
              onClick={() => handleAccountNeedUpdate(item.id as number)}
              title="Edit"
            >
              <IoPencilOutline />
            </div>
            <div
              className="flex justify-center px-2 py-1 cursor-pointer hover:text-slate-300 hover:bg-primary-10 rounded-lg"
              onClick={() => window.confirm('Bạn đã chắc chắn muốn xóa ?') && handleDeleteAccount(item.id as number)}
              title="Delete"
            >
              <AiFillDelete />
            </div>
          </td>
        )}
      </tr>
    );
  });

  const pageCount = Math.ceil(listUsers.length / membersPerPage);
  const changePage = ({ selected }: any) => {
    setPageNumber(selected);
  };
  return (
    <div className="relative flex mt-4 justify-center w-full flex-col px-4 lg:px-20 ">
      {createAccount ? (
        // Create member form
        <div className="animate-fadeIn absolute w-96 px-4 py-6 bg-primary-10 rounded-xl right-1/2 top-1/2 translate-x-1/2">
          <h1 className="text-xl mb-10 font-bold">{userNeedUpdate ? 'Update' : 'Add'} member account</h1>
          <div
            className="absolute right-1 top-1 p-1 bg-primary-20 rounded-3xl cursor-pointer hover:bg-primary-50"
            onClick={() => {
              setCreateAccount(false);
              setAccount({
                name: undefined,
                role: 'Employee',
                email: undefined,
                walletAddress: undefined,
              });
              setInvalidMail({ state: true, message: null });
              setInvalidNear({ state: true, message: null });
              setInvalidUserName({ state: true, message: null });
              setUserNeedUpdate(undefined);
            }}
          >
            <IoClose />
          </div>
          {/* User name */}
          <div>
            <label htmlFor="user-name" className="flex items-center">
              User name *
              {invalidUserName.message && <p className="text-xs text-red-500 ml-3 mt-1">{invalidUserName.message}</p>}
            </label>
            <input
              className={`h-10 w-full bg-primary-20 rounded-lg py-2 px-4  outline-none mt-1 ${
                invalidUserName.message ? 'border-2 border-red-500' : 'focus:border-[2px] focus:border-white'
              }`}
              id="user-name"
              value={account.name ? account.name : '' || (userNeedUpdate && (userNeedUpdate.name as string))}
              onChange={(e) => {
                setAccount({ ...account, name: e.target.value });
                setInvalidUserName(validateUserName(e.target.value));
                if (userNeedUpdate) {
                  setUserNeedUpdate({ ...userNeedUpdate, name: e.target.value });
                }
              }}
              onBlur={(e) => {
                setInvalidUserName(validateUserName(e.target.value));
                // userNeedUpdate && setInvalidUserName(validateUserName(e.target.value));
              }}
            />
          </div>
          {/* Email */}
          <div className="mt-3">
            <label htmlFor="email" className="flex items-center">
              Email *{invalidMail.message && <p className="text-xs text-red-500 ml-3 mt-1">{invalidMail.message}</p>}
            </label>
            <input
              className={`h-10 w-full bg-primary-20 rounded-lg py-2 px-4 outline-none mt-1 ${
                invalidMail.message ? 'border-2 border-red-500' : 'focus:border-[2px] focus:border-white'
              }`}
              id="email"
              value={account.email ? account.email : '' || (userNeedUpdate && (userNeedUpdate.email as string))}
              onChange={(e) => {
                setAccount({ ...account, email: e.target.value });
                setInvalidMail(validateEmail(e.target.value));
                userNeedUpdate && setUserNeedUpdate({ ...userNeedUpdate, email: e.target.value });
              }}
              onBlur={(e) => {
                setInvalidMail(validateEmail(e.target.value));
                // userNeedUpdate && setInvalidUserName(validateEmail(e.target.value));
              }}
            />
          </div>
          {/* Wallet Address */}

          <div className="mt-3 relative">
            <label htmlFor="wallet-address" className="flex items-center">
              Wallet address *
              {invalidNear.message && <p className="text-xs text-red-500 ml-3 mt-1">{invalidNear.message}</p>}
            </label>
            <input
              // placeholder=".testnet"
              disabled={userNeedUpdate && userNeedUpdate?.walletAddress !== ''}
              ref={walletInput || (userNeedUpdate && '')}
              className={`z-100 h-10 w-full bg-primary-20 rounded-lg py-2 px-4 outline-none mt-1 ${
                invalidNear.message ? 'border-2 border-red-500' : 'focus:border-[2px] focus:border-white'
              }  ${userNeedUpdate ? 'text-primary-60' : ''}`}
              id="wallet-address"
              value={
                account.walletAddress
                  ? account.walletAddress
                  : '' || (userNeedUpdate && (userNeedUpdate.walletAddress as string))
              }
              onChange={(e) => {
                const walletAddress = e.target.value;
                //create
                setAccount({ ...account, walletAddress: e.target.value });
                const checkExist = listUsers.find((user) => {
                  return user.walletAddress === walletAddress + '.testnet';
                });
                if (checkExist) {
                  setInvalidNear({ state: true, message: 'Wallet address was exist!' });
                } else setInvalidNear(validateNearAddress(walletAddress));
                //update
                if (userNeedUpdate) {
                  setUserNeedUpdate({ ...userNeedUpdate, walletAddress: e.target.value });
                  const checkExist = listUsers.find((user) => {
                    return user.walletAddress === walletAddress;
                  });
                  if (checkExist) {
                    setInvalidNear({ state: true, message: 'Wallet address was exist!' });
                  } else setInvalidNear(validateNearAddress(walletAddress));
                }
              }}
              onBlur={(e) => {
                const walletAddress = e.target.value;
                const checkExist = listUsers.find((user) => {
                  return user.walletAddress === walletAddress + '.testnet';
                });
                if (checkExist) {
                  setInvalidNear({ state: true, message: 'Wallet address was exist!' });
                } else setInvalidNear(validateNearAddress(walletAddress));
              }}
            />
            <span className={`absolute text-primary-50 left-4 bottom-2 flex `}>
              {
                <p className="text-transparent">
                  {account.walletAddress || (userNeedUpdate && userNeedUpdate.walletAddress)}
                </p>
              }
              {userNeedUpdate?.walletAddress?.indexOf('.testnet') ? '' : '.testnet'}
            </span>
          </div>
          {/* Role */}
          <div className="mt-2 mb-8 flex">
            <div>
              <input
                type="radio"
                id="user"
                name="role"
                value="Employee"
                className="mr-2"
                checked={userNeedUpdate ? userNeedUpdate.role === 'Employee' : account.role === 'Employee'}
                onChange={(e) => {
                  setAccount({ ...account, role: e.target.value });
                  userNeedUpdate && setUserNeedUpdate({ ...userNeedUpdate, role: e.target.value });
                }}
              />
              <label htmlFor="user">Employee</label>
            </div>
            <div className="ml-4">
              <input
                type="radio"
                id="admin"
                value="Admin"
                name="role"
                className="mr-2"
                checked={userNeedUpdate ? userNeedUpdate.role === 'Admin' : account.role === 'Admin'}
                onChange={(e) => {
                  setAccount({ ...account, role: e.target.value });
                  userNeedUpdate && setUserNeedUpdate({ ...userNeedUpdate, role: e.target.value });
                }}
              />
              <label htmlFor="admin">Admin</label>
            </div>
          </div>
          <div>
            {userNeedUpdate ? (
              <Button
                title={'update'}
                upcase={true}
                outline={true}
                active={false}
                group={false}
                idDisable={invalidMail.state || invalidNear.state || invalidUserName.state}
                css="absolute right-4 bottom-2"
                handle={() => window.confirm('Bạn chắc chắn muốn thay đổi ?') && handleUpdateAccount()}
              />
            ) : (
              <Button
                title={'create'}
                upcase={true}
                outline={true}
                active={false}
                group={false}
                idDisable={invalidMail.state || invalidNear.state || invalidUserName.state}
                css="absolute right-4 bottom-2"
                handle={handleCreateAccount}
              />
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="flex w-full justify-between mb-4">
            <h1 className="text-2xl font-semibold">Members</h1>
            <div hidden={userInfo.role !== 'Admin'}>
              <Button
                title="Add account"
                upcase={true}
                group={false}
                outline={true}
                active={false}
                css=""
                handle={() => {
                  setCreateAccount(true);
                }}
              />
            </div>
          </div>
          <table className="animate-fadeIn text-center m-0">
            <thead>
              <tr>
                <th className="border-t border-l border-r border-slate-300 px-4 py-2">No</th>
                <th className="border-t border-l border-r border-slate-300 px-4 py-2">Name</th>
                <th className="border-t border-l border-r border-slate-300 px-4 py-2">Role</th>
                <th className="border-t border-l border-r border-slate-300 px-4 py-2">Email</th>
                <th className="border-t border-l border-r border-slate-300 px-4 py-2">Wallet Address</th>
                <th
                  className="border-t border-l border-r border-slate-300 px-4 py-2"
                  hidden={userInfo.role !== 'Admin'}
                >
                  Action
                </th>
              </tr>
            </thead>
            {/* //pagination */}
            <tbody>{displaymembers}</tbody>
          </table>
          {listUsers.length > membersPerPage && (
            <div className="mt-3 flex items-center justify-center">
              <ReactPaginate
                className="flex p-1 rounded-xl bg-primary-10 mt-8 shadow-md"
                breakLabel="..."
                previousLabel={<IoArrowBack />}
                nextLabel={<IoArrowForward />}
                pageCount={pageCount}
                onPageChange={changePage}
                pageClassName="px-4 py-2 mx-1 rounded-md flex items-center hover:text-primary-90 hover:bg-primary-10"
                activeClassName="bg-primary-30 text-primary-90"
                previousClassName={`flex items-center px-2`}
                nextClassName={`flex items-center px-2 `}
                disabledClassName={'text-primary-20'}
              />
            </div>
          )}
        </>
      )}
      {loading === true && <Loading />}
    </div>
  );
};

export default Members;
