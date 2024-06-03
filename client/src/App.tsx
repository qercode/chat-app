import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {
  const authContext = useContext(AuthContext)
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={authContext?.authUser ? <Navigate to='/' /> : <Login />} />
          <Route path="/signup" element={authContext?.authUser ? <Navigate to='/' /> : <Signup />} />
          <Route path="/" element={authContext?.authUser ? <Home /> : <Navigate to='/login' />} />
        </Routes>
      </Router>
      <Toaster />
    </>

  );
}

export default App;
