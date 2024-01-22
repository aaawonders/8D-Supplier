import { BrowserRouter, useLocation, Route, Routes } from 'react-router-dom';
import './App.css';
import Sup8D from './components/PuP';
import TableClaims from './components/table';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/list/*" element={<TableClaims />} />
        <Route path="/8D/*" element={<Sup8D />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
