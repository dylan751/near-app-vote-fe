import Button from '../../components/Button/Button';
import { useRecoilValue } from 'recoil';
import { useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { UserInfo, ListUsers } from '../../recoil/users/UserInfo';
import { validateEmail, validateNearAddress, validateUserName } from '../../utils/ValidInput';

const Members: React.FC = () => {
  const listUsers = useRecoilValue(ListUsers);
  const userInfo = useRecoilValue(UserInfo);
  const walletInput = useRef<HTMLInputElement>(null);
  const [invalidUserName, setInvalidUserName] = useState<{ state: boolean; message: string | null }>({
    state: true,
    message: null,
  });
  const [invalidMail, setInvalidMail] = useState<{ state: boolean; message: string | null }>({
    state: true,
    message: null,
  });
  const [invalidNear, setInvalidNear] = useState<{ state: boolean; message: string | null }>({
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
  return (
    <div className="relative flex mt-4 justify-center w-full flex-col px-20">
      {createAccount ? (
        <div className="animate-fadeIn absolute w-96 px-4 py-6 bg-primary-10 rounded-xl right-1/2 top-1/2 translate-x-1/2">
          <h1 className="text-xl mb-10 font-bold">Add member account</h1>
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
              className={`h-10 w-full bg-primary-20 rounded-lg py-2 px-4 outline-none mt-1 ${
                invalidUserName.message ? 'border-2 border-red-500' : ''
              }`}
              id="user-name"
              value={account.name ? account.name : ''}
              onChange={(e) => {
                setAccount({ ...account, name: e.target.value });
                setInvalidUserName(validateUserName(e.target.value));
              }}
              onBlur={(e) => {
                setInvalidUserName(validateUserName(e.target.value));
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
                invalidMail.message ? 'border-2 border-red-500' : ''
              }`}
              id="email"
              value={account.email ? account.email : ''}
              onChange={(e) => {
                setAccount({ ...account, email: e.target.value });
                setInvalidMail(validateEmail(e.target.value));
              }}
              onBlur={(e) => {
                setInvalidMail(validateEmail(e.target.value));
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
              ref={walletInput}
              className={`z-100 h-10 w-full bg-primary-20 rounded-lg py-2 px-4 outline-none mt-1 ${
                invalidNear.message ? 'border-2 border-red-500' : ''
              }`}
              id="wallet-address"
              value={account.walletAddress ? account.walletAddress : ''}
              onChange={(e) => {
                const walletAddress = e.target.value;
                setAccount({ ...account, walletAddress: e.target.value });
                const checkExist = listUsers.find((user) => {
                  return user.walletAddress === walletAddress + '.testnet';
                });
                if (checkExist) {
                  setInvalidNear({ state: true, message: 'Wallet address was exist!' });
                } else setInvalidNear(validateNearAddress(walletAddress));
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
            <span className={`absolute text-primary-50 left-4 bottom-2 flex`}>
              {<p className="text-transparent">{account.walletAddress}</p>}.testnet
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
                checked={account.role === 'Employee'}
                onChange={(e) => {
                  setAccount({ ...account, role: e.target.value });
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
                checked={account.role === 'Admin'}
                onChange={(e) => {
                  setAccount({ ...account, role: e.target.value });
                }}
              />
              <label htmlFor="admin">Admin</label>
            </div>
          </div>
          <Button
            title="create"
            upcase={true}
            outline={true}
            active={false}
            group={false}
            idDisable={invalidMail.state || invalidNear.state || invalidUserName.state}
            css="absolute right-4 bottom-2"
            handle={handleCreateAccount}
          />
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
                <th className="border border-slate-300 px-4 py-2">No</th>
                <th className="border border-slate-300 px-4 py-2">Name</th>
                <th className="border border-slate-300 px-4 py-2">Role</th>
                <th className="border border-slate-300 px-4 py-2">Email</th>
                <th className="border border-slate-300 px-4 py-2">Wallet Address</th>
              </tr>
            </thead>
            <tbody>
              {listUsers.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <td className="border border-slate-300 px-3 py-1">{index + 1}</td>
                    <td className="border border-slate-300 px-3 py-1">{item.name}</td>
                    <td className="border border-slate-300 px-3 py-1">{item.role}</td>
                    <td className="border border-slate-300 px-3 py-1">{item.email}</td>
                    <td className="border border-slate-300 px-3 py-1">{item.walletAddress}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Members;
