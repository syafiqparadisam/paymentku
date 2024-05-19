import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn';
import NotFound from './pages/NotFound';
import Maintenance from './pages/Maintenance';
import User from './pages/User';
import UserProfile from './pages/UserProfile';
import NewPassword from './pages/NewPassword';
import ForgotPassword from './pages/ForgotPassword';
import HistoryTopup from './pages/HistoryTopup';
import HistoryTopupById from './pages/HistoryTopupById';
import HistoryTransfer from './pages/HistoryTransfer';
import HistoryTransferById from './pages/HistoryTransferById';
import Navbar from './component/Navbar';
import Footer from './component/Footer';
import PersistentLogin from './component/PersistentLogin';
import TopUp from './pages/TopUp';
import Settings from './pages/Settings';
import Help from './pages/Help';
import Transfer from './pages/Transfer';
import { GlobalStyles } from '@mui/material';

function App() {

  return (
    <>
    <GlobalStyles styles={[]}>

    </GlobalStyles>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path='/signin' element={<SignIn />} />
            <Route path='/forgotPassword' element={<ForgotPassword />} />
            <Route path='/maintenance' element={<Maintenance />} />
            <Route path='/passwordReset*' element={<NewPassword />} />
            <Route path='/signup' element={<SignUp />} />

            {/* CHECK AUTHORIZATION OR PROTECTED ROUTE */}

            <Route element={<PersistentLogin />}>
              <Route path='/dashboard'>
                <Route index element={<Dashboard />} />
                <Route path='topup'>
                  <Route index element={<TopUp />} />
                </Route>
                <Route path='transfer'>
                  <Route index element={<Transfer />} />
                </Route>
                <Route path='user'>
                  <Route index element={
                    <>
                      <User>
                        <UserProfile />
                      </User>
                    </>
                  } />
                  <Route path="settings" element={<Settings/>}/>
                  <Route path="help" element={<Help/>}/>
                  <Route path='history'>
                    <Route path='topup/:id' element={<HistoryTopupById />} />
                    <Route path='topup' element={<HistoryTopup />} />
                    <Route path='transfer/:id' element={<HistoryTransferById />} />
                    <Route path='transfer' element={<HistoryTransfer />} />
                  </Route>
                </Route>
              </Route>
            </Route>
            {/* nothing url match will redirect to 404 page then go / */}
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
        <Footer />
      </BrowserRouter >
    </>
  )
}

export default App
