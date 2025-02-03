import { BrowserRouter, useLocation, Route, Routes } from 'react-router-dom';
import './App.css';
import Sup8D from './components/PuP';
import TableClaims from './components/table';
import OpenClaim from './components/OpenClaim';
import { ChakraProvider } from '@chakra-ui/react'
import Claim from './components/claim';
import GetTable from './requests/gettable';
import TableItems from './components/TableItems.jsx';
import LoginPage from './components/login.jsx';
import MainPage from './pages/home.jsx';
import { useState } from 'react';
import Test from './pages/test.jsx';
import Forn from './components/forn.jsx';
import Profile from './components/Profile.jsx';


function App() {
  const [ userSetting, setUserSetting ] = useState(false)

  return (
    <div className="App">
      <ChakraProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/*" element={<MainPage userSetting={userSetting} setUserSetting={setUserSetting}/>} />
          <Route path="/login/*" element={<LoginPage />} />
          <Route path="/register/*" element={<LoginPage />} />
          <Route path="/open/*" element={<OpenClaim />} />
          <Route path="/list/*" element={<TableClaims />} />
          <Route path="/lnc/:year/:lnc" element={<Claim />} />
          <Route path="/8D/*" element={<Sup8D />} />
          <Route path="/gettable/*" element={<GetTable />} />
          <Route path="/listitems/*" element={<TableItems/>} />
          <Route path="/test/*" element={<Test />} />
          <Route path="/forn/:forn" element={<Forn />} />
          <Route path="/perfil/:id" element={<Profile />} />
        </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </div>
  );
}

export default App;
