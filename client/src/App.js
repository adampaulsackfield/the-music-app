import { Routes, Route } from 'react-router-dom';
import './App.scss';

// Components
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import SignUp from './components/SignUp/SignUp';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route element={<Navbar />}>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<SignUp />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
