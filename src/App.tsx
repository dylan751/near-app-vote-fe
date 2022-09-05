import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Trending from './pages/Trending';
import CreatePoll from './pages/CreatePoll';
import DefaultLayout from './components/Layout/DefaultLayout';
import OnlyHeader from './components/Layout/OnlyHeader';
import CreateOptions from './pages/CreateOptions';
import Organization from './pages/Organization';
import CreateCriteria from './pages/CreateCriteria';
import Error from './pages/Error';
import { getAllCriterias, CriteriasCall } from './recoil/create-criterias/CriteriaStates';
import { getAllOptions, OptionsCall } from './recoil/create-options/OptionsState';
import { PollsCall, getAllPolls } from './recoil/create-poll/PollsState';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { UserInfo, getAllUsers, ListUsers, IsMemberState } from './recoil/users/UserInfo';
import { sortByCreatedDate, sortUserList } from './utils/SortData';
import UpdatePoll from './pages/UpdatePoll';

const App: React.FC = () => {
  const setCriteriasCall = useSetRecoilState(CriteriasCall);
  const setOptions = useSetRecoilState(OptionsCall);
  const setPolls = useSetRecoilState(PollsCall);
  const [userInfo, setUserInfo] = useRecoilState(UserInfo);
  const setListUsers = useSetRecoilState(ListUsers);
  const [isMember, setIsMember] = useRecoilState(IsMemberState);
  // Get all criterias, options, info of user logined
  useEffect(() => {
    const getPolls = async () => {
      const allCriterias = await getAllCriterias(1000, 0);
      setCriteriasCall(sortByCreatedDate(allCriterias));
      // Set Options
      const allOptions = await getAllOptions(100, 0);
      setOptions(sortByCreatedDate(allOptions));
      // Set Polls
      const allPolls = await getAllPolls(100, 0);
      setPolls(
        allPolls.sort((a: any, b: any) => {
          return b.end_at - a.end_at;
        }),
      );
      // Set users
      const allUsers = await getAllUsers(100, 0);
      setListUsers(sortUserList(allUsers));
    };
    const getUserInfo = async (accountId: String) => {
      const userData = await window.contract.get_user_by_wallet_address({ wallet_address: accountId });
      if (userData) {
        setUserInfo({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          walletAddress: userData.user_wallet.wallet_address,
        });
        setIsMember(true);
      } else {
        setUserInfo({
          id: null,
          name: null,
          email: null,
          role: 'aaa',
          walletAddress: accountId as string,
        });
        setIsMember(false);
      }
    };
    if (window.accountId) {
      getUserInfo(window.accountId);
    }
    getPolls();
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <DefaultLayout>
                <Trending />
              </DefaultLayout>
            }
          />
          {userInfo.role === 'Admin' && (
            <>
              <Route
                path="/create-poll"
                element={
                  <DefaultLayout>
                    <CreatePoll />
                  </DefaultLayout>
                }
              />
              <Route
                path="/update-poll/:id"
                element={
                  <DefaultLayout>
                    <UpdatePoll />
                  </DefaultLayout>
                }
              />
              <Route
                path="/create-criterias"
                element={
                  <DefaultLayout>
                    <CreateCriteria create={true} list={false} />
                  </DefaultLayout>
                }
              />
              <Route
                path="/all-criterias"
                element={
                  <DefaultLayout>
                    <CreateCriteria create={false} list={true} />
                  </DefaultLayout>
                }
              />
              <Route
                path="/create-options"
                element={
                  <DefaultLayout>
                    <CreateOptions create={true} list={false} update={false} />
                  </DefaultLayout>
                }
              />
              <Route
                path="/all-options"
                element={
                  <DefaultLayout>
                    <CreateOptions create={false} list={true} update={false} />
                  </DefaultLayout>
                }
              />
              <Route
                path="/update-options/:option_id"
                element={
                  <DefaultLayout>
                    <CreateOptions create={false} list={false} update={true} />
                  </DefaultLayout>
                }
              />
            </>
          )}
          {isMember && (
            <Route path="/organization">
              <Route
                path="members"
                element={
                  <Organization
                    state={{ orverview: false, members: true, polls: false, answerOptions: false, voteResult: false }}
                  />
                }
              />
              <Route
                path="answer-options"
                element={
                  <Organization
                    state={{ orverview: false, members: false, polls: false, answerOptions: true, voteResult: false }}
                  />
                }
              />
              <Route
                path="polls"
                element={
                  <Organization
                    state={{ orverview: false, members: false, polls: true, answerOptions: false, voteResult: false }}
                  />
                }
              />
              <Route
                path="vote-results/:pollId"
                element={
                  <Organization
                    state={{ orverview: false, members: false, polls: false, answerOptions: false, voteResult: true }}
                  />
                }
              />
            </Route>
          )}

          {(userInfo.role || !window.accountId) && (
            <Route
              path="*"
              element={
                <OnlyHeader>
                  <Error />
                </OnlyHeader>
              }
            />
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
